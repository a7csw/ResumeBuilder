import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash, createHmac } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
}

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      plan_id?: string;
      user_id?: string;
      source?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      variant_id: number;
      variant_name: string;
      product_id: number;
      product_name: string;
      customer_id: number;
      order_id: number;
      identifier: string;
      order_number: number;
      user_name: string;
      user_email: string;
      status: string;
      status_formatted: string;
      refunded: boolean;
      refunded_at: string | null;
      subtotal: number;
      discount_total: number;
      tax: number;
      total: number;
      subtotal_usd: number;
      discount_total_usd: number;
      tax_usd: number;
      total_usd: number;
      tax_name: string | null;
      tax_rate: string;
      currency: string;
      created_at: string;
      updated_at: string;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify webhook signature
    const signature = req.headers.get('x-signature')
    const webhookSecret = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret')
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    // Get raw body for signature verification
    const body = await req.text()

    // Verify HMAC signature
    const hmac = createHmac('sha256', webhookSecret)
    hmac.update(body)
    const expectedSignature = `sha256=${hmac.toString('hex')}`

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    // Parse the payload
    const payload: LemonSqueezyWebhookPayload = JSON.parse(body)
    console.log(`Processing Lemon Squeezy webhook: ${payload.meta.event_name}`)

    // Handle the event
    switch (payload.meta.event_name) {
      case 'order_created': {
        if (payload.data.attributes.status === 'paid') {
          await handleSuccessfulPayment(supabaseClient, payload)
        }
        break
      }

      case 'subscription_created': {
        await handleSubscriptionCreated(supabaseClient, payload)
        break
      }

      case 'subscription_updated': {
        await handleSubscriptionUpdated(supabaseClient, payload)
        break
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        await handleSubscriptionCancelled(supabaseClient, payload)
        break
      }

      case 'order_refunded': {
        await handleOrderRefunded(supabaseClient, payload)
        break
      }

      default:
        console.log(`Unhandled event type: ${payload.meta.event_name}`)
    }

    // Log the billing event
    await supabaseClient.from('billing_events').insert({
      event_type: payload.meta.event_name,
      status: 'processed',
      metadata: payload,
      processed_at: new Date().toISOString(),
      user_id: payload.meta.custom_data?.user_id,
    })

    return new Response('Webhook processed successfully', { status: 200 })

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    // Log failed event
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      await supabaseClient.from('billing_events').insert({
        event_type: 'webhook.error',
        status: 'failed',
        metadata: { error: error.message },
        processed_at: new Date().toISOString(),
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return new Response('Webhook processing failed', { status: 500 })
  }
})

async function handleSuccessfulPayment(supabaseClient: any, payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data
  const userId = customData?.user_id
  const planId = customData?.plan_id

  if (!userId || !planId) {
    console.error('Missing userId or planId in custom data')
    return
  }

  console.log(`Processing payment for user ${userId}, plan ${planId}`)

  // Calculate plan expiry
  const now = new Date()
  const expiresAt = new Date(now)
  
  if (planId === 'basic') {
    expiresAt.setDate(expiresAt.getDate() + 10) // 10 days
  } else if (planId === 'pro') {
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month
  }

  // Set plan limits
  const limits = planId === 'basic' 
    ? { aiCallsLimit: 1, templatesLimit: 3, exportsLimit: 1 }
    : { aiCallsLimit: null, templatesLimit: null, exportsLimit: null } // unlimited for pro

  // Deactivate existing plans
  await supabaseClient
    .from('user_plans')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  // Create new plan
  const { error } = await supabaseClient
    .from('user_plans')
    .insert({
      user_id: userId,
      plan_type: planId,
      price_id: payload.data.attributes.variant_id.toString(),
      price_paid: payload.data.attributes.total_usd / 100, // Convert cents to dollars
      currency: payload.data.attributes.currency,
      is_active: true,
      starts_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      ai_calls_limit: limits.aiCallsLimit,
      ai_calls_used: 0,
      templates_limit: limits.templatesLimit,
      templates_used: 0,
      exports_limit: limits.exportsLimit,
      exports_used: 0,
      can_refund: true,
      security_alerts_enabled: true,
      plan_features: planId === 'basic' ? {
        watermark: true,
        templates: 3,
        ai_generations: 1,
        exports: 1,
        support: 'email',
        duration_days: 10
      } : {
        watermark: false,
        templates: -1,
        ai_generations: -1,
        exports: -1,
        support: 'priority',
        duration_days: 30
      }
    })

  if (error) {
    console.error('Error creating user plan:', error)
    throw error
  }

  console.log(`Successfully created ${planId} plan for user ${userId}`)
}

async function handleSubscriptionCreated(supabaseClient: any, payload: LemonSqueezyWebhookPayload) {
  // Handle subscription creation (for pro plan)
  console.log('Subscription created:', payload.data.id)
  // Implementation similar to handleSuccessfulPayment but for recurring subscriptions
}

async function handleSubscriptionUpdated(supabaseClient: any, payload: LemonSqueezyWebhookPayload) {
  // Handle subscription updates (renewals, etc.)
  console.log('Subscription updated:', payload.data.id)
}

async function handleSubscriptionCancelled(supabaseClient: any, payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data
  const userId = customData?.user_id

  if (!userId) {
    console.error('Missing userId in custom data')
    return
  }

  // Deactivate user plan
  await supabaseClient
    .from('user_plans')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_active', true)

  console.log(`Deactivated plan for user ${userId}`)
}

async function handleOrderRefunded(supabaseClient: any, payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data
  const userId = customData?.user_id

  if (!userId) {
    console.error('Missing userId in custom data')
    return
  }

  // Deactivate user plan and mark as refunded
  await supabaseClient
    .from('user_plans')
    .update({
      is_active: false,
      can_refund: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_active', true)

  console.log(`Processed refund for user ${userId}`)
}

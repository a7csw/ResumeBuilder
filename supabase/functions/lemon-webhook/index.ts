import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature",
};

const log = (msg: string, details?: any) => {
  console.log(`[LEMON-WEBHOOK] ${msg}`, details ?? "");
};

// Verify Lemon Squeezy webhook signature
async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(body)
    );

    return isValid;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("LEMON_WEBHOOK_SECRET");
    const paymentsProvider = Deno.env.get("PAYMENTS_PROVIDER");
    
    if (!webhookSecret) {
      throw new Error("Missing Lemon Squeezy webhook secret");
    }

    if (paymentsProvider !== 'lemonsqueezy') {
      log("Lemon Squeezy webhook called but payments provider is not set to lemonsqueezy");
      return new Response(JSON.stringify({ error: "Lemon Squeezy not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      throw new Error("Missing Lemon Squeezy signature");
    }

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }

    const event = JSON.parse(body);
    log("Webhook received", { type: event.meta.event_name, id: event.data.id });

    // Handle different event types
    switch (event.meta.event_name) {
      case "subscription_created": {
        const subscription = event.data.attributes;
        const customer = event.included?.find((item: any) => item.type === 'customers');
        
        if (!customer) {
          throw new Error("Customer not found in webhook data");
        }

        // Determine plan type based on product ID
        let planType = 'basic';
        if (subscription.product_id === Deno.env.get("VITE_LEMON_PRODUCT_AI")) {
          planType = 'ai';
        } else if (subscription.product_id === Deno.env.get("VITE_LEMON_PRODUCT_MONTHLY")) {
          planType = 'monthly';
        }

        // Calculate expiration date
        const currentPeriodEnd = new Date(subscription.renews_at || subscription.ends_at);
        
        // Update user plan in database
        const { error } = await supabase
          .from('user_plans')
          .upsert({
            user_id: customer.attributes.user_id || customer.attributes.email, // Use email as fallback
            plan_type: planType,
            is_active: true,
            current_period_end: currentPeriodEnd.toISOString(),
            lemon_customer_id: customer.id,
            lemon_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          log("Error updating user plan", error);
          throw error;
        }

        log("Subscription created successfully", { 
          customerId: customer.id, 
          subscriptionId: subscription.id,
          planType 
        });
        break;
      }

      case "subscription_updated": {
        const subscription = event.data.attributes;
        const customer = event.included?.find((item: any) => item.type === 'customers');
        
        if (!customer) {
          throw new Error("Customer not found in webhook data");
        }

        // Determine plan type based on product ID
        let planType = 'basic';
        if (subscription.product_id === Deno.env.get("VITE_LEMON_PRODUCT_AI")) {
          planType = 'ai';
        } else if (subscription.product_id === Deno.env.get("VITE_LEMON_PRODUCT_MONTHLY")) {
          planType = 'monthly';
        }

        const currentPeriodEnd = new Date(subscription.renews_at || subscription.ends_at);
        
        // Update user plan
        const { error } = await supabase
          .from('user_plans')
          .update({
            plan_type: planType,
            is_active: subscription.status === 'active',
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_customer_id', customer.id);

        if (error) {
          log("Error updating user plan", error);
          throw error;
        }

        log("Subscription updated successfully", { 
          customerId: customer.id, 
          subscriptionId: subscription.id,
          planType,
          status: subscription.status
        });
        break;
      }

      case "subscription_cancelled": {
        const subscription = event.data.attributes;
        const customer = event.included?.find((item: any) => item.type === 'customers');
        
        if (!customer) {
          throw new Error("Customer not found in webhook data");
        }

        // Update user plan to inactive
        const { error } = await supabase
          .from('user_plans')
          .update({
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_customer_id', customer.id);

        if (error) {
          log("Error cancelling user plan", error);
          throw error;
        }

        log("Subscription cancelled successfully", { 
          customerId: customer.id, 
          subscriptionId: subscription.id
        });
        break;
      }

      default:
        log("Unhandled event type", event.meta.event_name);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    log("Webhook error", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

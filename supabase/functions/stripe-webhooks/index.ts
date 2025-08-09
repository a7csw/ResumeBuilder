import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const log = (msg: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOKS] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("Missing Stripe signature");
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    log("Webhook received", { type: event.type, id: event.id });

    // Log the event
    await supabase.from("billing_events").insert({
      event_type: event.type,
      stripe_event_id: event.id,
      metadata: event.data.object,
      status: "processing"
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        log("Processing checkout completion", { sessionId: session.id });
        
        // Get customer email from session
        const customer = await stripe.customers.retrieve(session.customer as string);
        const customerEmail = (customer as any).email;
        
        if (!customerEmail) {
          throw new Error("No customer email found");
        }

        // Find user by email
        const { data: userData } = await supabase.auth.admin.listUsers();
        const user = userData.users.find(u => u.email === customerEmail);
        
        if (!user) {
          throw new Error(`No user found for email: ${customerEmail}`);
        }

        // Determine plan details from session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        const amount = session.amount_total;
        
        let planType = 'basic';
        let aiCallsLimit = 0;
        let expiresAt = new Date();
        
        // Set plan details based on amount and subscription mode
        if (session.mode === 'subscription') {
          planType = 'pro';
          aiCallsLimit = 200;
          expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        } else {
          // One-time payment
          if (amount === 700) { // $7.00
            planType = 'ai';
            aiCallsLimit = 30;
          } else if (amount === 300) { // $3.00
            planType = 'basic';
            aiCallsLimit = 0;
          }
          expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
        }

        // Create or update user plan
        const { error } = await supabase.from("user_plans").upsert({
          user_id: user.id,
          plan_type: planType,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          stripe_session_id: session.id,
          price_id: priceId,
          price_paid: amount,
          is_active: true,
          starts_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          ai_calls_limit: aiCallsLimit,
          can_refund: true
        }, {
          onConflict: 'user_id'
        });

        if (error) {
          throw error;
        }

        log("Plan activated", { userId: user.id, planType, sessionId: session.id });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        
        // Find user by customer ID
        const { data: planData } = await supabase
          .from("user_plans")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (planData) {
          const isActive = subscription.status === 'active';
          await supabase
            .from("user_plans")
            .update({ 
              is_active: isActive,
              expires_at: isActive ? new Date(subscription.current_period_end * 1000).toISOString() : new Date().toISOString()
            })
            .eq("user_id", planData.user_id);
          
          log("Subscription updated", { userId: planData.user_id, status: subscription.status });
        }
        break;
      }

      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const isSuccess = event.type === "invoice.payment_succeeded";
        
        // Update billing event status
        await supabase
          .from("billing_events")
          .update({ status: isSuccess ? "completed" : "failed" })
          .eq("stripe_event_id", event.id);
        
        log("Invoice payment processed", { invoiceId: invoice.id, success: isSuccess });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as any;
        const paymentIntent = charge.payment_intent;
        
        // Find the session and deactivate plan
        const { data: sessions } = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent,
          limit: 1
        });

        if (sessions.length > 0) {
          const session = sessions[0];
          await supabase
            .from("user_plans")
            .update({ 
              is_active: false,
              expires_at: new Date().toISOString()
            })
            .eq("stripe_session_id", session.id);
          
          log("Plan deactivated due to refund", { sessionId: session.id });
        }
        break;
      }

      default:
        log("Unhandled webhook type", { type: event.type });
    }

    // Update event status to completed
    await supabase
      .from("billing_events")
      .update({ 
        status: "completed",
        processed_at: new Date().toISOString()
      })
      .eq("stripe_event_id", event.id);

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", message);
    
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
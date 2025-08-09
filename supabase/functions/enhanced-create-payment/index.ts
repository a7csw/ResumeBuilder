import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: any) => {
  console.log(`[CREATE-PAYMENT] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { planType } = await req.json();
    if (!planType || !['basic', 'ai', 'pro'].includes(planType)) {
      throw new Error("Invalid plan type");
    }

    log("Creating payment session", { userId: user.id, email: user.email, planType });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Find or create customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({ 
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
    }

    const origin = req.headers.get("origin") || "https://sqvaqiepymfoubwibuds.supabase.co";
    
    // Plan configurations
    const planConfigs = {
      basic: {
        name: "Basic Plan",
        description: "Access to basic templates and PDF export",
        amount: 300, // $3.00
        mode: "payment" as const,
      },
      ai: {
        name: "AI Plan", 
        description: "Access to all templates + AI enhancement",
        amount: 700, // $7.00
        mode: "payment" as const,
      },
      pro: {
        name: "Pro Plan",
        description: "Everything + priority AI and version history",
        amount: 1500, // $15.00
        mode: "subscription" as const,
      }
    };

    const config = planConfigs[planType as keyof typeof planConfigs];
    
    const sessionConfig: any = {
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.amount,
          },
          quantity: 1,
        },
      ],
      mode: config.mode,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
      customer_update: {
        address: "auto",
      },
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
    };

    // Add recurring configuration for subscription
    if (config.mode === "subscription") {
      sessionConfig.line_items[0].price_data.recurring = {
        interval: "month",
      };
      sessionConfig.subscription_data = {
        metadata: {
          user_id: user.id,
          plan_type: planType,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    log("Payment session created", { 
      sessionId: session.id, 
      userId: user.id, 
      planType,
      mode: config.mode 
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", message);
    
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
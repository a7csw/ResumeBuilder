import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: any) => {
  console.log(`[CHECK-USER-PLAN] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    log("Checking plan for user", { userId: user.id });

    // Get active plan
    const { data: planData, error: planError } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (planError) {
      log("Plan query error", planError);
      throw planError;
    }

    // Default to free plan if no active plan found
    if (!planData) {
      log("No active plan found, defaulting to free");
      return new Response(JSON.stringify({
        plan: 'free',
        isActive: false,
        expiresAt: null,
        canUseAI: false,
        canExportPDF: false,
        canUseAITemplates: false,
        canAccessTemplates: true,
        aiCallsUsed: 0,
        aiCallsLimit: 0,
        canRefund: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if plan has expired
    const now = new Date();
    const expiresAt = new Date(planData.expires_at);
    const isExpired = expiresAt < now;

    if (isExpired && planData.is_active) {
      // Deactivate expired plan
      await supabase
        .from("user_plans")
        .update({ is_active: false })
        .eq("id", planData.id);
      
      log("Plan expired and deactivated", { planId: planData.id });
      
      return new Response(JSON.stringify({
        plan: 'free',
        isActive: false,
        expiresAt: planData.expires_at,
        canUseAI: false,
        canExportPDF: false,
        canUseAITemplates: false,
        canAccessTemplates: true,
        aiCallsUsed: planData.ai_calls_used || 0,
        aiCallsLimit: 0,
        canRefund: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Determine capabilities based on plan
    const canUseAI = planData.plan_type === 'ai' || planData.plan_type === 'pro';
    const canExportPDF = ['basic', 'ai', 'pro'].includes(planData.plan_type);
    const canUseAITemplates = planData.plan_type === 'ai' || planData.plan_type === 'pro';
    const canAccessTemplates = true;

    // Check refund eligibility
    const canRefund = planData.can_refund && 
                     !planData.first_export_at && 
                     planData.plan_type !== 'pro'; // No refunds for subscriptions

    log("Plan check completed", { 
      userId: user.id, 
      plan: planData.plan_type, 
      isActive: true,
      canRefund 
    });

    return new Response(JSON.stringify({
      plan: planData.plan_type,
      isActive: true,
      expiresAt: planData.expires_at,
      canUseAI,
      canExportPDF,
      canUseAITemplates,
      canAccessTemplates,
      aiCallsUsed: planData.ai_calls_used || 0,
      aiCallsLimit: planData.ai_calls_limit || 0,
      canRefund,
      startedFillingAt: planData.started_filling_at,
      firstExportAt: planData.first_export_at
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", message);
    
    // Return free plan on error
    return new Response(JSON.stringify({
      plan: 'free',
      isActive: false,
      expiresAt: null,
      canUseAI: false,
      canExportPDF: false,
      canUseAITemplates: false,
      canAccessTemplates: true,
      aiCallsUsed: 0,
      aiCallsLimit: 0,
      canRefund: false,
      error: message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
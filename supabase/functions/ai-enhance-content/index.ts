import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: any) => {
  console.log(`[AI-ENHANCE] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

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
    if (!user) throw new Error("User not authenticated");

    // Check user plan and AI usage
    const { data: planData } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!planData || !['ai', 'pro'].includes(planData.plan_type)) {
      throw new Error("AI features require AI or Pro plan");
    }

    // Check AI usage limits
    const aiCallsUsed = planData.ai_calls_used || 0;
    const aiCallsLimit = planData.ai_calls_limit || 0;
    
    if (aiCallsUsed >= aiCallsLimit) {
      throw new Error("AI usage limit reached for your plan");
    }

    const { type, content, context } = await req.json();
    
    if (!type || !content) {
      throw new Error("Missing required fields: type, content");
    }

    log("Processing AI enhancement", { 
      userId: user.id, 
      type, 
      aiCallsUsed: aiCallsUsed + 1, 
      aiCallsLimit 
    });

    let prompt = "";
    
    switch (type) {
      case "summary":
        prompt = `Create a professional resume summary (2-3 sentences) for a ${context?.role || 'professional'} in ${context?.industry || 'their field'}. 
        Current content: "${content}"
        
        Make it compelling, achievement-focused, and ATS-friendly. Use strong action words and quantify achievements where possible.`;
        break;
        
      case "bullets":
        prompt = `Enhance these work experience bullet points for a ${context?.role || 'professional'} resume:
        "${content}"
        
        Rules:
        1. Start each bullet with a strong action verb
        2. Include metrics and numbers where possible
        3. Use keywords relevant to ${context?.industry || 'the industry'}
        4. Make them ATS-friendly and impactful
        5. Keep each bullet under 20 words
        6. Return exactly 3-5 enhanced bullet points`;
        break;
        
      case "skills":
        prompt = `Suggest relevant skills for a ${context?.role || 'professional'} in ${context?.industry || 'their field'}.
        Current skills: "${content}"
        
        Return a JSON array of 8-12 skills including:
        - Technical skills specific to the role
        - Soft skills valued in the industry
        - Tools and technologies commonly used
        - Mix current skills with suggested additions
        
        Format: ["skill1", "skill2", "skill3", ...]`;
        break;
        
      case "achievements":
        prompt = `Convert these job responsibilities into achievement-focused bullet points:
        "${content}"
        
        Transform each responsibility into a quantified achievement using STAR method (Situation, Task, Action, Result).
        Use metrics, percentages, dollar amounts, or time savings where logical.
        Start each with a strong action verb.
        Maximum 4 bullet points.`;
        break;
        
      default:
        throw new Error("Invalid enhancement type");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert resume writer and career coach. Provide professional, ATS-optimized content that helps candidates stand out to both applicant tracking systems and human recruiters.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedContent = data.choices[0].message.content;

    // Update AI usage counter
    await supabase
      .from("user_plans")
      .update({ 
        ai_calls_used: aiCallsUsed + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", planData.id);

    log("AI enhancement completed", { 
      userId: user.id, 
      type,
      newUsage: aiCallsUsed + 1 
    });

    return new Response(JSON.stringify({ 
      enhancedContent,
      remainingCalls: aiCallsLimit - (aiCallsUsed + 1)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
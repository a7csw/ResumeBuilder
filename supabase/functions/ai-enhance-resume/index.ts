import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) throw new Error('Unauthorized');

    const { section, content, userType, jobTitle, industry } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (section) {
      case 'summary':
        systemPrompt = `You are an expert resume writer. Create a compelling professional summary that highlights key achievements and skills. Keep it concise (2-3 sentences) and ATS-friendly.`;
        userPrompt = `Create a professional summary for a ${userType} in ${industry || 'their field'} ${jobTitle ? `applying for ${jobTitle}` : ''}. Current content: "${content || 'No existing content'}"`;
        break;
      
      case 'experience':
        systemPrompt = `You are an expert resume writer. Enhance work experience descriptions with action verbs, quantified achievements, and relevant keywords. Focus on impact and results.`;
        userPrompt = `Enhance this work experience description for a ${userType}: "${content}". Add action verbs, quantify achievements where possible, and make it ATS-friendly.`;
        break;
      
      case 'skills':
        systemPrompt = `You are an expert resume writer. Suggest relevant technical and soft skills based on the user's profile and industry standards.`;
        userPrompt = `Suggest 8-12 relevant skills for a ${userType} in ${industry || 'their field'} ${jobTitle ? `applying for ${jobTitle}` : ''}. Mix technical and soft skills. Current skills: "${content || 'None listed'}"`;
        break;
      
      case 'achievements':
        systemPrompt = `You are an expert resume writer. Transform basic accomplishments into compelling achievement statements with metrics and impact.`;
        userPrompt = `Transform these accomplishments into powerful achievement statements: "${content}". Add specific metrics, percentages, or other quantifiable results where logical.`;
        break;
      
      default:
        systemPrompt = `You are an expert resume writer. Provide professional, ATS-friendly content that highlights the candidate's strengths.`;
        userPrompt = `Improve this resume section content: "${content}" for a ${userType} in ${industry || 'their field'}.`;
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const enhancedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ enhancedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-enhance-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
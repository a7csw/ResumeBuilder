import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: any) => {
  console.log(`[INPUT-SANITIZER] ${msg}`, details ?? "");
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

    const { content, contentType } = await req.json();

    if (!content) {
      throw new Error("No content provided for sanitization");
    }

    log("Sanitizing content", { 
      userId: user.id, 
      contentType: contentType || "unknown",
      contentLength: content.length 
    });

    // Rate limiting for sanitization requests
    const clientIP = req.headers.get("cf-connecting-ip") || 
                    req.headers.get("x-forwarded-for") || 
                    "unknown";

    const rateLimitResult = await supabase.rpc('check_rate_limit', {
      p_identifier: clientIP,
      p_action_type: 'input_sanitization',
      p_max_attempts: 100,
      p_window_minutes: 60
    });

    if (!rateLimitResult.data) {
      log("Rate limit exceeded for sanitization", { ip: clientIP });
      return new Response(JSON.stringify({ 
        error: "Too many sanitization requests. Please try again later." 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    // Comprehensive input sanitization
    const sanitizedContent = await sanitizeContent(content, contentType);
    const riskScore = calculateContentRiskScore(content, sanitizedContent);

    // Log high-risk content attempts
    if (riskScore > 5) {
      await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_action_type: 'HIGH_RISK_CONTENT_DETECTED',
        p_resource_type: 'input_sanitization',
        p_details: {
          content_type: contentType,
          risk_score: riskScore,
          original_length: content.length,
          sanitized_length: sanitizedContent.length,
          removed_elements: content.length - sanitizedContent.length
        },
        p_ip_address: clientIP,
        p_user_agent: req.headers.get("user-agent") || "unknown",
        p_risk_score: riskScore
      });
    }

    log("Content sanitization completed", { 
      userId: user.id,
      originalLength: content.length,
      sanitizedLength: sanitizedContent.length,
      riskScore 
    });

    return new Response(JSON.stringify({
      success: true,
      sanitizedContent,
      metadata: {
        originalLength: content.length,
        sanitizedLength: sanitizedContent.length,
        riskScore,
        removedCharacters: content.length - sanitizedContent.length,
        sanitizationApplied: content !== sanitizedContent
      }
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

async function sanitizeContent(content: string, contentType?: string): Promise<string> {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let sanitized = content;

  // 1. Remove potentially dangerous HTML/XML tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<meta\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 2. Remove dangerous attributes
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick, onload, etc.
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:(?!image\/)/gi, ''); // Allow data: for images only

  // 3. Sanitize specific content types
  if (contentType === 'resume_content') {
    sanitized = sanitizeResumeContent(sanitized);
  } else if (contentType === 'personal_info') {
    sanitized = sanitizePersonalInfo(sanitized);
  }

  // 4. General security sanitization
  sanitized = sanitized.replace(/[<>]/g, ''); // Remove angle brackets
  sanitized = sanitized.replace(/&(?!amp;|lt;|gt;|quot;|#39;)/g, '&amp;'); // Escape unescaped ampersands
  
  // 5. Limit length to prevent DoS
  const maxLength = getMaxLengthForContentType(contentType);
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...';
  }

  // 6. Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

function sanitizeResumeContent(content: string): string {
  // Specific sanitization for resume content
  let sanitized = content;
  
  // Remove potential SQL injection patterns
  sanitized = sanitized.replace(/('|(\\\\')|(;)|(union)|(select)|(insert)|(update)|(delete)|(drop)|(create)|(alter)/gi, '');
  
  // Remove URLs that aren't standard web protocols
  sanitized = sanitized.replace(/\b(?!https?:\/\/|mailto:)[a-z]+:\/\/\S+/gi, '');
  
  // Limit special characters
  sanitized = sanitized.replace(/[^\w\s\-.,@()[\]{}:;"'\/\\+=%#]/g, '');
  
  return sanitized;
}

function sanitizePersonalInfo(content: string): string {
  // Extra protection for personal information
  let sanitized = content;
  
  // Remove patterns that look like SQL injection
  sanitized = sanitized.replace(/['";<>{}]/g, '');
  
  // Remove excessive special characters but keep necessary ones for names/addresses
  sanitized = sanitized.replace(/[^\w\s\-.,@()[\]:;"'\/\\\/]/g, '');
  
  return sanitized;
}

function getMaxLengthForContentType(contentType?: string): number {
  switch (contentType) {
    case 'personal_info':
      return 500;
    case 'resume_content':
      return 10000;
    case 'description':
      return 2000;
    default:
      return 1000;
  }
}

function calculateContentRiskScore(original: string, sanitized: string): number {
  let riskScore = 0;
  
  // Check for script tags
  if (/<script/gi.test(original)) riskScore += 10;
  
  // Check for event handlers
  if (/\s+on\w+\s*=/gi.test(original)) riskScore += 8;
  
  // Check for javascript: protocol
  if (/javascript:/gi.test(original)) riskScore += 9;
  
  // Check for data: URLs (except images)
  if (/data:(?!image\/)/gi.test(original)) riskScore += 7;
  
  // Check for SQL injection patterns
  if (/(union|select|insert|update|delete|drop|create|alter)\s+/gi.test(original)) riskScore += 6;
  
  // Check for excessive HTML tags
  const htmlTagCount = (original.match(/<[^>]+>/g) || []).length;
  if (htmlTagCount > 10) riskScore += 5;
  
  // Check for content removal percentage
  const removalPercentage = ((original.length - sanitized.length) / original.length) * 100;
  if (removalPercentage > 50) riskScore += 8;
  if (removalPercentage > 25) riskScore += 4;
  
  // Check for suspicious patterns
  if (/\.\.|\/\.\./g.test(original)) riskScore += 5; // Path traversal
  if (/<iframe|<object|<embed/gi.test(original)) riskScore += 7; // Embedding
  
  return Math.min(riskScore, 100);
}

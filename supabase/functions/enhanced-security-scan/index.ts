import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: any) => {
  console.log(`[SECURITY-SCAN] ${msg}`, details ?? "");
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

    const clientIP = req.headers.get("cf-connecting-ip") || 
                    req.headers.get("x-forwarded-for") || 
                    "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Rate limiting check
    const rateLimitResult = await supabase.rpc('check_rate_limit', {
      p_identifier: user.id,
      p_action_type: 'security_scan',
      p_max_attempts: 5,
      p_window_minutes: 60
    });

    if (!rateLimitResult.data) {
      log("Rate limit exceeded", { userId: user.id, ip: clientIP });
      await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_action_type: 'RATE_LIMIT_EXCEEDED',
        p_resource_type: 'security_scan',
        p_ip_address: clientIP,
        p_user_agent: userAgent,
        p_risk_score: 3
      });
      
      return new Response(JSON.stringify({ 
        error: "Rate limit exceeded. Please try again later." 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    log("Starting comprehensive security scan", { userId: user.id });

    // 1. Check for suspicious user behavior
    const suspiciousPatterns = await checkSuspiciousPatterns(supabase, user.id);
    
    // 2. Analyze recent security events
    const recentEvents = await analyzeSecurityEvents(supabase, user.id);
    
    // 3. Check data access patterns
    const dataAccessPatterns = await checkDataAccess(supabase, user.id);
    
    // 4. Validate user plan integrity
    const planIntegrity = await validatePlanIntegrity(supabase, user.id);

    // Calculate overall risk score
    const riskScore = calculateRiskScore([
      suspiciousPatterns,
      recentEvents, 
      dataAccessPatterns,
      planIntegrity
    ]);

    // Log security scan completion
    await supabase.rpc('log_security_event', {
      p_user_id: user.id,
      p_action_type: 'SECURITY_SCAN_COMPLETED',
      p_resource_type: 'security_audit',
      p_details: {
        risk_score: riskScore,
        scan_timestamp: new Date().toISOString(),
        findings_count: [suspiciousPatterns, recentEvents, dataAccessPatterns, planIntegrity]
          .reduce((sum, result) => sum + result.issues.length, 0)
      },
      p_ip_address: clientIP,
      p_user_agent: userAgent,
      p_risk_score: riskScore
    });

    log("Security scan completed", { 
      userId: user.id, 
      riskScore,
      totalIssues: [suspiciousPatterns, recentEvents, dataAccessPatterns, planIntegrity]
        .reduce((sum, result) => sum + result.issues.length, 0)
    });

    return new Response(JSON.stringify({
      success: true,
      riskScore,
      scanResults: {
        suspiciousPatterns,
        recentEvents,
        dataAccessPatterns,
        planIntegrity
      },
      recommendations: generateRecommendations(riskScore, [
        suspiciousPatterns,
        recentEvents,
        dataAccessPatterns,
        planIntegrity
      ])
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

async function checkSuspiciousPatterns(supabase: any, userId: string) {
  const issues: string[] = [];
  
  try {
    // Check for multiple rapid plan changes
    const { data: planChanges } = await supabase
      .from('security_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('action_type', 'UPDATE')
      .eq('resource_type', 'user_plan')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (planChanges && planChanges.length > 3) {
      issues.push(`Suspicious: ${planChanges.length} plan changes in 24 hours`);
    }

    // Check for unusual access patterns
    const { data: accessLogs } = await supabase
      .from('security_audit_logs')
      .select('ip_address, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (accessLogs) {
      const uniqueIPs = new Set(accessLogs.map((log: any) => log.ip_address).filter(Boolean));
      if (uniqueIPs.size > 10) {
        issues.push(`Suspicious: Access from ${uniqueIPs.size} different IP addresses`);
      }
    }

  } catch (error) {
    log("Error checking suspicious patterns", error);
  }

  return {
    category: "Suspicious Patterns",
    issues,
    severity: issues.length > 0 ? (issues.length > 2 ? "HIGH" : "MEDIUM") : "LOW"
  };
}

async function analyzeSecurityEvents(supabase: any, userId: string) {
  const issues: string[] = [];
  
  try {
    // Check for recent high-risk events
    const { data: highRiskEvents } = await supabase
      .from('security_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('risk_score', 5)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (highRiskEvents && highRiskEvents.length > 0) {
      issues.push(`${highRiskEvents.length} high-risk security events in past week`);
    }

    // Check for rate limit violations
    const { data: rateLimitEvents } = await supabase
      .from('security_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('action_type', 'RATE_LIMIT_EXCEEDED')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (rateLimitEvents && rateLimitEvents.length > 0) {
      issues.push(`${rateLimitEvents.length} rate limit violations in past 24 hours`);
    }

  } catch (error) {
    log("Error analyzing security events", error);
  }

  return {
    category: "Security Events",
    issues,
    severity: issues.length > 0 ? "MEDIUM" : "LOW"
  };
}

async function checkDataAccess(supabase: any, userId: string) {
  const issues: string[] = [];
  
  try {
    // Check for excessive data access
    const { data: accessCount } = await supabase
      .from('security_audit_logs')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (accessCount && accessCount.length > 1000) {
      issues.push(`Excessive data access: ${accessCount.length} operations in 24 hours`);
    }

  } catch (error) {
    log("Error checking data access", error);
  }

  return {
    category: "Data Access",
    issues,
    severity: issues.length > 0 ? "MEDIUM" : "LOW"
  };
}

async function validatePlanIntegrity(supabase: any, userId: string) {
  const issues: string[] = [];
  
  try {
    // Check for plan consistency
    const { data: userPlans } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (userPlans && userPlans.length > 1) {
      issues.push(`Multiple active plans detected: ${userPlans.length} plans`);
    }

    if (userPlans && userPlans.length === 1) {
      const plan = userPlans[0];
      
      // Check for plan expiry issues
      if (plan.expires_at && new Date(plan.expires_at) < new Date()) {
        issues.push("Active plan has expired but not deactivated");
      }

      // Check for AI usage anomalies
      if (plan.ai_calls_used > plan.ai_calls_limit && plan.ai_calls_limit > 0) {
        issues.push(`AI usage exceeded limit: ${plan.ai_calls_used}/${plan.ai_calls_limit}`);
      }
    }

  } catch (error) {
    log("Error validating plan integrity", error);
  }

  return {
    category: "Plan Integrity",
    issues,
    severity: issues.length > 0 ? "HIGH" : "LOW"
  };
}

function calculateRiskScore(results: any[]): number {
  let score = 0;
  
  results.forEach(result => {
    const issueCount = result.issues.length;
    switch (result.severity) {
      case "HIGH":
        score += issueCount * 5;
        break;
      case "MEDIUM":
        score += issueCount * 3;
        break;
      case "LOW":
        score += issueCount * 1;
        break;
    }
  });
  
  return Math.min(score, 100); // Cap at 100
}

function generateRecommendations(riskScore: number, results: any[]): string[] {
  const recommendations: string[] = [];
  
  if (riskScore > 20) {
    recommendations.push("Enable additional security monitoring");
    recommendations.push("Review recent account activity");
  }
  
  if (riskScore > 50) {
    recommendations.push("Consider temporarily restricting account access");
    recommendations.push("Require password reset on next login");
  }
  
  results.forEach(result => {
    if (result.issues.length > 0) {
      switch (result.category) {
        case "Suspicious Patterns":
          recommendations.push("Monitor for unusual access patterns");
          break;
        case "Security Events":
          recommendations.push("Review and investigate recent security events");
          break;
        case "Data Access":
          recommendations.push("Implement stricter rate limiting");
          break;
        case "Plan Integrity":
          recommendations.push("Audit and fix plan configuration issues");
          break;
      }
    }
  });
  
  return [...new Set(recommendations)]; // Remove duplicates
}
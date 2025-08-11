-- Fix security linter warnings - Function Search Path
-- Add SET search_path for all functions to improve security

-- Fix search_path for log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_action_type TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_risk_score INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id, action_type, resource_type, resource_id,
    details, ip_address, user_agent, risk_score
  ) VALUES (
    p_user_id, p_action_type, p_resource_type, p_resource_id,
    p_details, p_ip_address, p_user_agent, p_risk_score
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Fix search_path for sanitize_user_input function
CREATE OR REPLACE FUNCTION public.sanitize_user_input(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove potentially dangerous characters and limit length
  RETURN LEFT(
    REGEXP_REPLACE(
      REGEXP_REPLACE(input_text, '[<>"\''&]', '', 'g'),
      '\s+', ' ', 'g'
    ),
    1000
  );
END;
$$;

-- Fix search_path for encrypt_sensitive_data function
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data_text TEXT, encryption_key TEXT DEFAULT 'default_key')
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF data_text IS NULL OR data_text = '' THEN
    RETURN data_text;
  END IF;
  
  -- Simple obfuscation (in production, use proper encryption)
  RETURN encode(data_text::bytea, 'base64');
END;
$$;

-- Fix search_path for trigger_audit_log function
CREATE OR REPLACE FUNCTION public.trigger_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log changes to user_plans
  IF TG_TABLE_NAME = 'user_plans' THEN
    PERFORM public.log_security_event(
      COALESCE(NEW.user_id, OLD.user_id),
      TG_OP,
      'user_plan',
      COALESCE(NEW.id::TEXT, OLD.id::TEXT),
      jsonb_build_object(
        'old_plan', CASE WHEN OLD IS NOT NULL THEN OLD.plan_type END,
        'new_plan', CASE WHEN NEW IS NOT NULL THEN NEW.plan_type END,
        'change_time', NOW()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix search_path for check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_attempts INTEGER := 0;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN := FALSE;
BEGIN
  -- Check if currently blocked
  SELECT blocked_until > NOW() INTO is_blocked
  FROM public.rate_limits
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Get or create rate limit record
  INSERT INTO public.rate_limits (identifier, action_type, attempt_count, window_start)
  VALUES (p_identifier, p_action_type, 1, NOW())
  ON CONFLICT (identifier, action_type) DO UPDATE SET
    attempt_count = CASE 
      WHEN rate_limits.window_start < NOW() - INTERVAL '1 hour' * p_window_minutes / 60 THEN 1
      ELSE rate_limits.attempt_count + 1
    END,
    window_start = CASE
      WHEN rate_limits.window_start < NOW() - INTERVAL '1 hour' * p_window_minutes / 60 THEN NOW()
      ELSE rate_limits.window_start
    END
  RETURNING attempt_count INTO current_attempts;
  
  -- Block if exceeded
  IF current_attempts > p_max_attempts THEN
    UPDATE public.rate_limits 
    SET blocked_until = NOW() + INTERVAL '1 hour'
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Add RLS policy for rate_limits table that was missing
CREATE POLICY "Service role can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (current_setting('role'::text) = 'service_role'::text);
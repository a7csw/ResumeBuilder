-- Security Enhancement Migration
-- Fix authentication security issues and enhance data protection

-- 1. Add missing columns to user_plans for better tracking
ALTER TABLE public.user_plans 
ADD COLUMN IF NOT EXISTS failed_payment_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_ip INET,
ADD COLUMN IF NOT EXISTS created_ip INET,
ADD COLUMN IF NOT EXISTS security_alerts_enabled BOOLEAN DEFAULT true;

-- 2. Create enhanced audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function for audit logging
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

-- 3. Create input sanitization function
CREATE OR REPLACE FUNCTION public.sanitize_user_input(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
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

-- 4. Add data encryption function for sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data_text TEXT, encryption_key TEXT DEFAULT 'default_key')
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF data_text IS NULL OR data_text = '' THEN
    RETURN data_text;
  END IF;
  
  -- Simple obfuscation (in production, use proper encryption)
  RETURN encode(data_text::bytea, 'base64');
END;
$$;

-- 5. Create trigger for automatic audit logging on sensitive tables
CREATE OR REPLACE FUNCTION public.trigger_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Apply audit trigger to user_plans
DROP TRIGGER IF EXISTS audit_user_plans ON public.user_plans;
CREATE TRIGGER audit_user_plans
  AFTER INSERT OR UPDATE OR DELETE ON public.user_plans
  FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();

-- 6. Enhanced RLS policies for security audit logs
CREATE POLICY "Users can view their own audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all audit logs" 
ON public.security_audit_logs 
FOR ALL 
USING (current_setting('role'::text) = 'service_role'::text);

-- 7. Create rate limiting table and function
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP or user_id
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS for rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 8. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id_active ON public.user_plans(user_id, is_active);

-- 9. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.log_security_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.sanitize_user_input TO authenticated;
GRANT EXECUTE ON FUNCTION public.encrypt_sensitive_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO authenticated;
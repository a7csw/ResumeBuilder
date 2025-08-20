-- Migration to update pricing structure for Basic ($5/10 days) and Pro ($11/month) plans
-- Update: 2025-01-19

-- Add new columns for enhanced plan management
ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS templates_limit INTEGER,
ADD COLUMN IF NOT EXISTS templates_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS exports_limit INTEGER,
ADD COLUMN IF NOT EXISTS exports_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan_features JSONB;

-- Update existing plan types to match new structure
UPDATE user_plans 
SET plan_type = 'basic' 
WHERE plan_type IN ('free', 'starter');

UPDATE user_plans 
SET plan_type = 'pro' 
WHERE plan_type IN ('ai', 'monthly', 'premium', 'professional');

-- Set default limits for existing plans
UPDATE user_plans 
SET 
  templates_limit = CASE 
    WHEN plan_type = 'basic' THEN 3
    ELSE NULL -- unlimited for pro
  END,
  exports_limit = CASE 
    WHEN plan_type = 'basic' THEN 1
    ELSE NULL -- unlimited for pro
  END,
  ai_calls_limit = CASE 
    WHEN plan_type = 'basic' THEN 1
    ELSE NULL -- unlimited for pro
  END,
  plan_features = CASE 
    WHEN plan_type = 'basic' THEN '{
      "watermark": true,
      "templates": 3,
      "ai_generations": 1,
      "exports": 1,
      "support": "email",
      "duration_days": 10
    }'::jsonb
    ELSE '{
      "watermark": false,
      "templates": -1,
      "ai_generations": -1,
      "exports": -1,
      "support": "priority",
      "duration_days": 30
    }'::jsonb
  END
WHERE plan_features IS NULL;

-- Update exports_logs table to track export limits
ALTER TABLE export_logs
ADD COLUMN IF NOT EXISTS plan_features JSONB;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id_active ON user_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_plans_plan_type ON user_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_user_plans_expires_at ON user_plans(expires_at);
CREATE INDEX IF NOT EXISTS idx_export_logs_user_id ON export_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON billing_events(user_id);

-- Add constraint to ensure only one active plan per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_plans_one_active_per_user 
ON user_plans(user_id) 
WHERE is_active = true;

-- Update RLS policies for new structure
DROP POLICY IF EXISTS "Users can view their own plans" ON user_plans;
DROP POLICY IF EXISTS "Users can insert their own plans" ON user_plans;
DROP POLICY IF EXISTS "Users can update their own plans" ON user_plans;

CREATE POLICY "Users can view their own plans" ON user_plans
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage all plans" ON user_plans
  FOR ALL USING (auth.role() = 'service_role');

-- Add function to check plan capabilities
CREATE OR REPLACE FUNCTION check_plan_capability(
  p_user_id TEXT,
  p_capability TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_plan RECORD;
  v_features JSONB;
BEGIN
  -- Get user's active plan
  SELECT * INTO v_plan
  FROM user_plans
  WHERE user_id = p_user_id 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY created_at DESC
  LIMIT 1;

  -- No active plan
  IF v_plan IS NULL THEN
    RETURN FALSE;
  END IF;

  v_features := v_plan.plan_features;

  -- Check specific capabilities
  CASE p_capability
    WHEN 'ai_generation' THEN
      IF v_features->>'ai_generations' = '-1' THEN
        RETURN TRUE; -- unlimited
      ELSE
        RETURN (v_plan.ai_calls_used < (v_features->>'ai_generations')::INTEGER);
      END IF;
    
    WHEN 'template_access' THEN
      IF v_features->>'templates' = '-1' THEN
        RETURN TRUE; -- unlimited
      ELSE
        RETURN (COALESCE(v_plan.templates_used, 0) < (v_features->>'templates')::INTEGER);
      END IF;
    
    WHEN 'export' THEN
      IF v_features->>'exports' = '-1' THEN
        RETURN TRUE; -- unlimited
      ELSE
        RETURN (COALESCE(v_plan.exports_used, 0) < (v_features->>'exports')::INTEGER);
      END IF;
    
    WHEN 'no_watermark' THEN
      RETURN (v_features->>'watermark')::BOOLEAN = FALSE;
    
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to increment usage counters
CREATE OR REPLACE FUNCTION increment_plan_usage(
  p_user_id TEXT,
  p_usage_type TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_plan_id TEXT;
BEGIN
  -- Get user's active plan ID
  SELECT id INTO v_plan_id
  FROM user_plans
  WHERE user_id = p_user_id 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_plan_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Increment the appropriate counter
  CASE p_usage_type
    WHEN 'ai_calls' THEN
      UPDATE user_plans 
      SET ai_calls_used = COALESCE(ai_calls_used, 0) + 1,
          updated_at = NOW()
      WHERE id = v_plan_id;
    
    WHEN 'templates' THEN
      UPDATE user_plans 
      SET templates_used = COALESCE(templates_used, 0) + 1,
          updated_at = NOW()
      WHERE id = v_plan_id;
    
    WHEN 'exports' THEN
      UPDATE user_plans 
      SET exports_used = COALESCE(exports_used, 0) + 1,
          updated_at = NOW()
      WHERE id = v_plan_id;
      
      -- Mark as non-refundable after first export
      UPDATE user_plans 
      SET can_refund = FALSE,
          first_export_at = COALESCE(first_export_at, NOW())
      WHERE id = v_plan_id;
    
    ELSE
      RETURN FALSE;
  END CASE;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to automatically expire old plans
CREATE OR REPLACE FUNCTION auto_expire_plans() RETURNS TRIGGER AS $$
BEGIN
  -- Deactivate expired plans
  UPDATE user_plans 
  SET is_active = FALSE, 
      updated_at = NOW()
  WHERE expires_at < NOW() 
    AND is_active = TRUE;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_expire_plans ON user_plans;
CREATE TRIGGER trigger_auto_expire_plans
  AFTER INSERT OR UPDATE ON user_plans
  FOR EACH STATEMENT
  EXECUTE FUNCTION auto_expire_plans();

-- Create a view for easy plan information access
CREATE OR REPLACE VIEW user_plan_info AS
SELECT 
  up.user_id,
  up.plan_type,
  up.is_active,
  up.expires_at,
  up.ai_calls_used,
  up.ai_calls_limit,
  up.templates_used,
  up.templates_limit,
  up.exports_used,
  up.exports_limit,
  up.can_refund,
  up.price_paid,
  up.currency,
  up.plan_features,
  (up.expires_at > NOW() OR up.expires_at IS NULL) AS is_valid,
  CASE 
    WHEN up.expires_at IS NULL THEN NULL
    ELSE EXTRACT(days FROM (up.expires_at - NOW()))
  END AS days_remaining
FROM user_plans up
WHERE up.is_active = TRUE;

-- Grant permissions
GRANT SELECT ON user_plan_info TO authenticated;
GRANT EXECUTE ON FUNCTION check_plan_capability(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_plan_usage(TEXT, TEXT) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE user_plans IS 'Stores user subscription plans with usage tracking';
COMMENT ON FUNCTION check_plan_capability(TEXT, TEXT) IS 'Check if user has access to specific plan capability';
COMMENT ON FUNCTION increment_plan_usage(TEXT, TEXT) IS 'Increment usage counters for plan limits';
COMMENT ON VIEW user_plan_info IS 'Convenient view for accessing user plan information with calculated fields';

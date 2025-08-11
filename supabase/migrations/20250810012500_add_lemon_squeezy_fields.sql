-- Add Lemon Squeezy fields to user_plans table
-- This migration adds Lemon Squeezy customer and subscription IDs
-- while keeping existing Stripe fields for backward compatibility

-- Add Lemon Squeezy fields to user_plans table
ALTER TABLE public.user_plans 
ADD COLUMN IF NOT EXISTS lemon_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_subscription_id TEXT;

-- Add Lemon Squeezy fields to billing_events table
ALTER TABLE public.billing_events 
ADD COLUMN IF NOT EXISTS lemon_event_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS lemon_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_subscription_id TEXT;

-- Update the plan_type check constraint to include 'monthly' (Lemon Squeezy uses 'monthly' instead of 'pro')
ALTER TABLE public.user_plans 
DROP CONSTRAINT IF EXISTS user_plans_plan_type_check;

ALTER TABLE public.user_plans 
ADD CONSTRAINT user_plans_plan_type_check 
CHECK (plan_type IN ('basic', 'ai', 'pro', 'monthly'));

-- Add indexes for Lemon Squeezy fields
CREATE INDEX IF NOT EXISTS idx_user_plans_lemon_customer_id ON public.user_plans(lemon_customer_id) WHERE lemon_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_plans_lemon_subscription_id ON public.user_plans(lemon_subscription_id) WHERE lemon_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_billing_events_lemon_event_id ON public.billing_events(lemon_event_id) WHERE lemon_event_id IS NOT NULL;

-- Add comment to document the dual payment provider support
COMMENT ON TABLE public.user_plans IS 'User subscription plans supporting both Stripe and Lemon Squeezy payment providers';
COMMENT ON COLUMN public.user_plans.stripe_customer_id IS 'Stripe customer ID (legacy)';
COMMENT ON COLUMN public.user_plans.stripe_subscription_id IS 'Stripe subscription ID (legacy)';
COMMENT ON COLUMN public.user_plans.lemon_customer_id IS 'Lemon Squeezy customer ID';
COMMENT ON COLUMN public.user_plans.lemon_subscription_id IS 'Lemon Squeezy subscription ID';

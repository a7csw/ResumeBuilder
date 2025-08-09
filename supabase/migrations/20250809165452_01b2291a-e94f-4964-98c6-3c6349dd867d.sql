-- Enhanced user_plans table for production monetization
DROP TABLE IF EXISTS user_plans CASCADE;

CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'ai', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_session_id TEXT,
  price_id TEXT,
  price_paid INTEGER, -- amount in cents
  currency TEXT DEFAULT 'usd',
  is_active BOOLEAN DEFAULT false,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  started_filling_at TIMESTAMPTZ,
  first_export_at TIMESTAMPTZ,
  can_refund BOOLEAN DEFAULT true,
  ai_calls_used INTEGER DEFAULT 0,
  ai_calls_limit INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Billing events log for audit trail
CREATE TABLE public.billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  metadata JSONB,
  processed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Export audit log
CREATE TABLE public.export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  template_id TEXT NOT NULL,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'docx')),
  file_hash TEXT,
  file_size INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced resumes table
ALTER TABLE public."Resumes" 
ADD COLUMN IF NOT EXISTS template_id TEXT,
ADD COLUMN IF NOT EXISTS is_exported BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS export_count INTEGER DEFAULT 0;

-- Enable RLS on all tables
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_plans
CREATE POLICY "Users can view their own plans" ON public.user_plans
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" ON public.user_plans
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" ON public.user_plans
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all plans" ON public.user_plans
FOR ALL USING (current_setting('role') = 'service_role');

-- RLS Policies for billing_events
CREATE POLICY "Users can view their own billing events" ON public.billing_events
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all billing events" ON public.billing_events
FOR ALL USING (current_setting('role') = 'service_role');

-- RLS Policies for export_logs
CREATE POLICY "Users can view their own export logs" ON public.export_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own export logs" ON public.export_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all export logs" ON public.export_logs
FOR ALL USING (current_setting('role') = 'service_role');

-- Triggers for updated_at
CREATE TRIGGER update_user_plans_updated_at
BEFORE UPDATE ON public.user_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_user_plans_user_id ON public.user_plans(user_id);
CREATE INDEX idx_user_plans_active ON public.user_plans(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_billing_events_user_id ON public.billing_events(user_id);
CREATE INDEX idx_export_logs_user_id ON public.export_logs(user_id);
CREATE INDEX idx_stripe_events ON public.billing_events(stripe_event_id) WHERE stripe_event_id IS NOT NULL;
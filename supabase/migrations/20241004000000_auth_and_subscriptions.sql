-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('single', '10days', 'monthly')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE,
    resumes_used INTEGER DEFAULT 0,
    resumes_limit INTEGER,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gumroad_order_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_resumes table
CREATE TABLE IF NOT EXISTS public.user_resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    content JSONB NOT NULL,
    template_type TEXT DEFAULT 'professional',
    is_exported BOOLEAN DEFAULT FALSE,
    export_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON public.user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON public.user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resumes_created_at ON public.user_resumes(created_at DESC);

-- Enable RLS on tables
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_resumes
CREATE POLICY "Users can view own resumes" ON public.user_resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON public.user_resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.user_resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.user_resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON public.user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_resumes_updated_at 
    BEFORE UPDATE ON public.user_resumes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check and update subscription status
CREATE OR REPLACE FUNCTION check_subscription_status(user_uuid UUID)
RETURNS TABLE (
    has_access BOOLEAN,
    plan_type TEXT,
    resumes_remaining INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT
) AS $$
DECLARE
    subscription RECORD;
BEGIN
    -- Get the most recent active subscription
    SELECT * INTO subscription
    FROM public.user_subscriptions
    WHERE user_id = user_uuid 
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;

    -- If no subscription found
    IF subscription IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, 0, NULL::TIMESTAMP WITH TIME ZONE, 'none'::TEXT;
        RETURN;
    END IF;

    -- Check if subscription has expired
    IF subscription.expires_at IS NOT NULL AND subscription.expires_at < NOW() THEN
        -- Update status to expired
        UPDATE public.user_subscriptions 
        SET status = 'expired' 
        WHERE id = subscription.id;
        
        RETURN QUERY SELECT FALSE, subscription.plan_type, 0, subscription.expires_at, 'expired'::TEXT;
        RETURN;
    END IF;

    -- Calculate remaining resumes for single plan
    IF subscription.plan_type = 'single' THEN
        RETURN QUERY SELECT 
            (subscription.resumes_used < COALESCE(subscription.resumes_limit, 1)),
            subscription.plan_type,
            GREATEST(0, COALESCE(subscription.resumes_limit, 1) - subscription.resumes_used),
            subscription.expires_at,
            subscription.status;
    ELSE
        -- For 10days and monthly plans, unlimited resumes during valid period
        RETURN QUERY SELECT 
            TRUE,
            subscription.plan_type,
            -1, -- Unlimited
            subscription.expires_at,
            subscription.status;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

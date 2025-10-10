-- Gumroad Subscription System Migration
-- This replaces the old subscription system with Gumroad-specific tracking

-- Drop old tables if they exist
DROP TABLE IF EXISTS public.user_plans CASCADE;
DROP TABLE IF EXISTS public.billing_events CASCADE;
DROP TABLE IF EXISTS public.export_logs CASCADE;

-- Create new gumroad_subscriptions table
CREATE TABLE IF NOT EXISTS public.gumroad_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Product information
    product_id TEXT NOT NULL CHECK (product_id IN ('single_resume', '10day_access', 'monthly_subscription')),
    product_name TEXT NOT NULL,
    
    -- Gumroad transaction details
    gumroad_order_id TEXT UNIQUE,
    gumroad_product_id TEXT,
    gumroad_permalink TEXT,
    
    -- Pricing information
    price_paid INTEGER NOT NULL, -- in cents (Euro)
    currency TEXT DEFAULT 'EUR',
    
    -- Access control
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Usage tracking
    resumes_generated INTEGER DEFAULT 0,
    resumes_limit INTEGER, -- NULL for unlimited plans
    
    -- Timestamps
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_resumes table for tracking generated resumes
CREATE TABLE IF NOT EXISTS public.user_resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.gumroad_subscriptions(id) ON DELETE SET NULL,
    
    -- Resume details
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    content JSONB NOT NULL,
    template_type TEXT DEFAULT 'professional',
    
    -- Export tracking
    is_exported BOOLEAN DEFAULT FALSE,
    export_count INTEGER DEFAULT 0,
    pdf_generated BOOLEAN DEFAULT FALSE,
    docx_generated BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gumroad_subscriptions_user_id ON public.gumroad_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_gumroad_subscriptions_status ON public.gumroad_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_gumroad_subscriptions_expires_at ON public.gumroad_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_gumroad_subscriptions_order_id ON public.gumroad_subscriptions(gumroad_order_id);
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON public.user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resumes_subscription_id ON public.user_resumes(subscription_id);

-- Enable RLS
ALTER TABLE public.gumroad_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gumroad_subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.gumroad_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.gumroad_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.gumroad_subscriptions
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
CREATE TRIGGER update_gumroad_subscriptions_updated_at 
    BEFORE UPDATE ON public.gumroad_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_resumes_updated_at 
    BEFORE UPDATE ON public.user_resumes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check user access and get subscription details
CREATE OR REPLACE FUNCTION get_user_access_status(user_uuid UUID)
RETURNS TABLE (
    has_access BOOLEAN,
    product_id TEXT,
    product_name TEXT,
    resumes_remaining INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT,
    subscription_id UUID
) AS $$
DECLARE
    subscription RECORD;
    current_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Get the most recent active subscription
    SELECT * INTO subscription
    FROM public.gumroad_subscriptions
    WHERE user_id = user_uuid 
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;

    -- If no subscription found
    IF subscription IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, 0, NULL::TIMESTAMP WITH TIME ZONE, 'none'::TEXT, NULL::UUID;
        RETURN;
    END IF;

    -- Check if subscription has expired (for time-based plans)
    IF subscription.expires_at IS NOT NULL AND subscription.expires_at < current_time THEN
        -- Update status to expired
        UPDATE public.gumroad_subscriptions 
        SET status = 'expired' 
        WHERE id = subscription.id;
        
        RETURN QUERY SELECT FALSE, subscription.product_id, subscription.product_name, 0, subscription.expires_at, 'expired'::TEXT, subscription.id;
        RETURN;
    END IF;

    -- Handle different product types
    CASE subscription.product_id
        WHEN 'single_resume' THEN
            -- Single resume: check if limit reached
            RETURN QUERY SELECT 
                (subscription.resumes_generated < COALESCE(subscription.resumes_limit, 1)),
                subscription.product_id,
                subscription.product_name,
                GREATEST(0, COALESCE(subscription.resumes_limit, 1) - subscription.resumes_generated),
                subscription.expires_at,
                subscription.status,
                subscription.id;
        
        WHEN '10day_access' THEN
            -- 10-day access: unlimited during valid period
            RETURN QUERY SELECT 
                TRUE,
                subscription.product_id,
                subscription.product_name,
                -1, -- Unlimited
                subscription.expires_at,
                subscription.status,
                subscription.id;
        
        WHEN 'monthly_subscription' THEN
            -- 30-day pro pass: unlimited during valid period
            RETURN QUERY SELECT 
                TRUE,
                subscription.product_id,
                subscription.product_name,
                -1, -- Unlimited
                subscription.expires_at,
                subscription.status,
                subscription.id;
        
        ELSE
            -- Unknown product type
            RETURN QUERY SELECT FALSE, subscription.product_id, subscription.product_name, 0, subscription.expires_at, 'unknown'::TEXT, subscription.id;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new subscription after Gumroad purchase
CREATE OR REPLACE FUNCTION create_gumroad_subscription(
    user_uuid UUID,
    product_id_param TEXT,
    gumroad_order_id_param TEXT,
    price_paid_param INTEGER
)
RETURNS UUID AS $$
DECLARE
    new_subscription_id UUID;
    product_name_param TEXT;
    expires_at_param TIMESTAMP WITH TIME ZONE;
    resumes_limit_param INTEGER;
BEGIN
    -- Set product details based on product_id
    CASE product_id_param
        WHEN 'single_resume' THEN
            product_name_param := 'Single Resume';
            expires_at_param := NULL; -- No expiry for single resume
            resumes_limit_param := 1;
        
        WHEN '10day_access' THEN
            product_name_param := '10-Day Access';
            expires_at_param := NOW() + INTERVAL '10 days';
            resumes_limit_param := NULL; -- Unlimited
        
        WHEN 'monthly_subscription' THEN
            product_name_param := '30-Day Pro Pass';
            expires_at_param := NOW() + INTERVAL '30 days';
            resumes_limit_param := NULL; -- Unlimited
        
        ELSE
            RAISE EXCEPTION 'Invalid product_id: %', product_id_param;
    END CASE;

    -- Insert new subscription
    INSERT INTO public.gumroad_subscriptions (
        user_id,
        product_id,
        product_name,
        gumroad_order_id,
        price_paid,
        expires_at,
        resumes_limit
    ) VALUES (
        user_uuid,
        product_id_param,
        product_name_param,
        gumroad_order_id_param,
        price_paid_param,
        expires_at_param,
        resumes_limit_param
    ) RETURNING id INTO new_subscription_id;

    RETURN new_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment resume count for a subscription
CREATE OR REPLACE FUNCTION increment_resume_count(subscription_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
    limit_count INTEGER;
BEGIN
    -- Get current count and limit
    SELECT resumes_generated, resumes_limit 
    INTO current_count, limit_count
    FROM public.gumroad_subscriptions
    WHERE id = subscription_uuid AND status = 'active';

    -- Check if subscription exists
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Check if limit would be exceeded (only for limited plans)
    IF limit_count IS NOT NULL AND current_count >= limit_count THEN
        RETURN FALSE;
    END IF;

    -- Increment the count
    UPDATE public.gumroad_subscriptions
    SET resumes_generated = resumes_generated + 1
    WHERE id = subscription_uuid;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


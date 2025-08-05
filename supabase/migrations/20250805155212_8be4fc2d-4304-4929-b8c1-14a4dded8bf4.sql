-- Add has_paid_plan column to profiles table to track user subscription status
ALTER TABLE public.profiles 
ADD COLUMN has_paid_plan BOOLEAN DEFAULT false;

-- Update existing profiles to have free plan initially
UPDATE public.profiles 
SET has_paid_plan = false 
WHERE has_paid_plan IS NULL;
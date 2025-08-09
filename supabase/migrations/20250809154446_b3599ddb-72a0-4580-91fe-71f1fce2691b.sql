-- Create table to track resume downloads for refund policy enforcement
CREATE TABLE IF NOT EXISTS public.resume_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;

-- Policies: users can insert/select their own download records
CREATE POLICY "users_can_insert_own_downloads"
ON public.resume_downloads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_select_own_downloads"
ON public.resume_downloads
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_resume_downloads_user_id ON public.resume_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_downloads_created_at ON public.resume_downloads(created_at);

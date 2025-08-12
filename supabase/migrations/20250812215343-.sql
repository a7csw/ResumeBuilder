-- Update resumes table to support new 2-step flow
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS color_variant text DEFAULT 'default',
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS exported_at timestamp with time zone;

-- Add check constraint for mode
ALTER TABLE resumes 
ADD CONSTRAINT check_mode CHECK (mode IN ('student', 'professional', 'freelancer'));

-- Update existing records to have default mode
UPDATE resumes SET mode = 'professional' WHERE mode IS NULL;
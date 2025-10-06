-- Add ward_circle column to bla_members table
-- This column will store the Ward/Circle/Uraatchi information

-- Add the column if it doesn't exist
ALTER TABLE bla_members 
ADD COLUMN IF NOT EXISTS ward_circle TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN bla_members.ward_circle IS 'Ward/Circle/Uraatchi information (வட்டம் / ஊராட்சி / வார்டு)';

-- Optional: Create an index for faster searches
CREATE INDEX IF NOT EXISTS idx_bla_members_ward_circle ON bla_members(ward_circle);

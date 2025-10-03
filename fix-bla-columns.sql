-- Add missing columns to bla_members table for form compatibility
-- Run this in Supabase SQL Editor

-- Add missing columns that appear in the BLA registration form
DO $$
BEGIN
    -- Add area/union/city field (பகுதி / ஒன்றியம் / நகரம்)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'area_union_city') THEN
        ALTER TABLE public.bla_members ADD COLUMN area_union_city VARCHAR(200);
    END IF;
    
    -- Add ward/village field (வட்டம் / ஊராட்சி / வார்டு)  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'ward_village') THEN
        ALTER TABLE public.bla_members ADD COLUMN ward_village VARCHAR(200);
    END IF;
    
    -- Ensure all existing columns that might be missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'part_number') THEN
        ALTER TABLE public.bla_members ADD COLUMN part_number VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'aadhaar_number') THEN
        ALTER TABLE public.bla_members ADD COLUMN aadhaar_number VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'religion') THEN
        ALTER TABLE public.bla_members ADD COLUMN religion VARCHAR(100);
    END IF;
    
    -- Add registered_by_employee_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id') THEN
        ALTER TABLE public.bla_members ADD COLUMN registered_by_employee_id UUID;
        ALTER TABLE public.bla_members ADD CONSTRAINT fk_bla_members_employee FOREIGN KEY (registered_by_employee_id) REFERENCES public.employees(id);
    END IF;
    
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_bla_members_area_union_city ON public.bla_members(area_union_city);
CREATE INDEX IF NOT EXISTS idx_bla_members_ward_village ON public.bla_members(ward_village);

-- Show all columns in bla_members table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bla_members' 
ORDER BY ordinal_position;
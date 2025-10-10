-- Migration Script: Update BLA Members Table
-- Purpose: Remove address requirement and ensure religion field is properly configured
-- Date: 2025-10-10

-- This script safely updates the bla_members table structure
-- Run this in your Supabase SQL Editor

-- Step 1: Make address nullable (since it's been removed from the form)
DO $$ 
BEGIN
    -- Check if address column exists and is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bla_members' 
        AND column_name = 'address' 
        AND is_nullable = 'NO'
    ) THEN
        -- Make address nullable
        ALTER TABLE public.bla_members ALTER COLUMN address DROP NOT NULL;
        RAISE NOTICE 'Address column is now nullable';
    ELSE
        RAISE NOTICE 'Address column is already nullable or does not exist';
    END IF;
END $$;

-- Step 2: Ensure religion column exists
DO $$ 
BEGIN
    -- Check if religion column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bla_members' 
        AND column_name = 'religion'
    ) THEN
        -- Add religion column
        ALTER TABLE public.bla_members ADD COLUMN religion VARCHAR(100);
        RAISE NOTICE 'Religion column added';
    ELSE
        RAISE NOTICE 'Religion column already exists';
    END IF;
END $$;

-- Step 3: Ensure ward_circle column exists (for ward/circle/uraatchi data)
DO $$ 
BEGIN
    -- Check if ward_circle column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bla_members' 
        AND column_name = 'ward_circle'
    ) THEN
        -- Add ward_circle column
        ALTER TABLE public.bla_members ADD COLUMN ward_circle VARCHAR(200);
        RAISE NOTICE 'Ward_circle column added';
    ELSE
        RAISE NOTICE 'Ward_circle column already exists';
    END IF;
END $$;

-- Step 4: Ensure registered_by_employee_id column exists
DO $$ 
BEGIN
    -- Check if registered_by_employee_id column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bla_members' 
        AND column_name = 'registered_by_employee_id'
    ) THEN
        -- Add registered_by_employee_id column
        ALTER TABLE public.bla_members ADD COLUMN registered_by_employee_id UUID;
        
        -- Add foreign key constraint if employees table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employees') THEN
            ALTER TABLE public.bla_members 
            ADD CONSTRAINT fk_bla_members_employee 
            FOREIGN KEY (registered_by_employee_id) 
            REFERENCES public.employees(id);
            RAISE NOTICE 'Registered_by_employee_id column added with foreign key';
        ELSE
            RAISE NOTICE 'Registered_by_employee_id column added (employees table not found for FK)';
        END IF;
    ELSE
        RAISE NOTICE 'Registered_by_employee_id column already exists';
    END IF;
END $$;

-- Step 5: Create indexes for better performance
DO $$
BEGIN
    -- Index on religion for filtering
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bla_members_religion') THEN
        CREATE INDEX idx_bla_members_religion ON public.bla_members(religion);
        RAISE NOTICE 'Index on religion created';
    END IF;
    
    -- Index on ward_circle for filtering
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bla_members_ward_circle') THEN
        CREATE INDEX idx_bla_members_ward_circle ON public.bla_members(ward_circle);
        RAISE NOTICE 'Index on ward_circle created';
    END IF;
    
    -- Index on voter_id for lookups
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bla_members_voter_id') THEN
        CREATE INDEX idx_bla_members_voter_id ON public.bla_members(voter_id);
        RAISE NOTICE 'Index on voter_id created';
    END IF;
    
    -- Index on part_number for filtering
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bla_members_part_number') THEN
        CREATE INDEX idx_bla_members_part_number ON public.bla_members(part_number);
        RAISE NOTICE 'Index on part_number created';
    END IF;
END $$;

-- Step 6: Add comment to religion column for documentation
COMMENT ON COLUMN public.bla_members.religion IS 'Religion of the member: இந்து, இஸ்லாம், கிறிஸ்தவம், பௌத்தம், சமணம், சீக்கியம், மற்றவை';

-- Step 7: Add comment to ward_circle column for documentation
COMMENT ON COLUMN public.bla_members.ward_circle IS 'Ward/Circle/Uraatchi information for the member';

-- Step 8: Update any existing records with NULL address to empty string (optional)
-- Uncomment if you want to clean up existing data
-- UPDATE public.bla_members SET address = '' WHERE address IS NULL;

-- Step 9: Verify the changes
DO $$
DECLARE
    address_nullable TEXT;
    religion_exists BOOLEAN;
    ward_circle_exists BOOLEAN;
    registered_by_exists BOOLEAN;
BEGIN
    -- Check address nullability
    SELECT is_nullable INTO address_nullable
    FROM information_schema.columns 
    WHERE table_name = 'bla_members' AND column_name = 'address';
    
    -- Check religion column
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bla_members' AND column_name = 'religion'
    ) INTO religion_exists;
    
    -- Check ward_circle column
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bla_members' AND column_name = 'ward_circle'
    ) INTO ward_circle_exists;
    
    -- Check registered_by_employee_id column
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id'
    ) INTO registered_by_exists;
    
    -- Report status
    RAISE NOTICE '=== MIGRATION VERIFICATION ===';
    RAISE NOTICE 'Address nullable: %', address_nullable;
    RAISE NOTICE 'Religion exists: %', religion_exists;
    RAISE NOTICE 'Ward_circle exists: %', ward_circle_exists;
    RAISE NOTICE 'Registered_by_employee_id exists: %', registered_by_exists;
    RAISE NOTICE '=== MIGRATION COMPLETE ===';
END $$;

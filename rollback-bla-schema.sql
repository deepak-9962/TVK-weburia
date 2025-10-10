-- Rollback Script: Revert BLA Members Table Changes
-- Use this ONLY if you need to revert to the previous schema
-- Date: 2025-10-10

-- WARNING: This will make address required again and remove indexes
-- Only run this if you need to undo the migration

-- Step 1: Make address NOT NULL again (if you want to revert)
-- CAUTION: This will fail if any records have NULL address
DO $$ 
BEGIN
    -- First, update any NULL addresses to empty string
    UPDATE public.bla_members SET address = '' WHERE address IS NULL;
    
    -- Then make it NOT NULL
    ALTER TABLE public.bla_members ALTER COLUMN address SET NOT NULL;
    
    RAISE NOTICE '✅ Address is now NOT NULL again';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE '❌ Failed to make address NOT NULL: %', SQLERRM;
END $$;

-- Step 2: Remove indexes (optional - usually you want to keep these)
-- Uncomment only if you really want to remove them

-- DROP INDEX IF EXISTS idx_bla_members_religion;
-- DROP INDEX IF EXISTS idx_bla_members_ward_circle;
-- DROP INDEX IF EXISTS idx_bla_members_voter_id;
-- DROP INDEX IF EXISTS idx_bla_members_part_number;

-- Step 3: Remove foreign key constraint on registered_by_employee_id
-- Uncomment only if you want to remove employee tracking

-- DO $$
-- BEGIN
--     ALTER TABLE public.bla_members DROP CONSTRAINT IF EXISTS fk_bla_members_employee;
--     RAISE NOTICE '✅ Foreign key constraint removed';
-- EXCEPTION
--     WHEN others THEN
--         RAISE NOTICE '❌ Failed to remove FK constraint: %', SQLERRM;
-- END $$;

-- Step 4: Remove columns (DANGEROUS - will lose data!)
-- Uncomment ONLY if you absolutely need to remove these columns
-- THIS WILL DELETE ALL DATA IN THESE COLUMNS!

-- DO $$
-- BEGIN
--     -- Remove ward_circle column
--     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'ward_circle') THEN
--         ALTER TABLE public.bla_members DROP COLUMN ward_circle;
--         RAISE NOTICE '⚠️ Ward_circle column removed (data lost)';
--     END IF;
--     
--     -- Remove registered_by_employee_id column
--     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id') THEN
--         ALTER TABLE public.bla_members DROP COLUMN registered_by_employee_id;
--         RAISE NOTICE '⚠️ Registered_by_employee_id column removed (data lost)';
--     END IF;
-- END $$;

-- Verification
DO $$
DECLARE
    address_nullable TEXT;
BEGIN
    SELECT is_nullable INTO address_nullable
    FROM information_schema.columns 
    WHERE table_name = 'bla_members' AND column_name = 'address';
    
    RAISE NOTICE '=== ROLLBACK VERIFICATION ===';
    RAISE NOTICE 'Address nullable: %', address_nullable;
    RAISE NOTICE '=== ROLLBACK COMPLETE ===';
    RAISE NOTICE 'NOTE: Religion and ward_circle columns are kept (no harm in keeping them)';
END $$;

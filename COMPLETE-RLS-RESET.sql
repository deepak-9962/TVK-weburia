-- COMPLETE RLS RESET FOR bla_members TABLE
-- Run this entire script in Supabase SQL Editor

-- Step 1: Drop ALL policies (including any we might have missed)
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'bla_members'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.bla_members', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 2: Disable RLS
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant public access (for anon key)
GRANT ALL ON public.bla_members TO anon;
GRANT ALL ON public.bla_members TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Verify the changes
SELECT 
    'RLS Status' as check_type,
    CASE WHEN relrowsecurity THEN 'ENABLED ❌' ELSE 'DISABLED ✓' END as status
FROM pg_class 
WHERE relname = 'bla_members';

SELECT 
    'Policy Count' as check_type,
    COUNT(*)::text || ' policies' as status
FROM pg_policies 
WHERE tablename = 'bla_members';

SELECT 
    'Table Permissions' as check_type,
    string_agg(privilege_type, ', ') as status
FROM information_schema.table_privileges
WHERE table_name = 'bla_members' 
AND grantee = 'anon';

-- Step 5: Test query
SELECT COUNT(*) as total_members FROM public.bla_members;

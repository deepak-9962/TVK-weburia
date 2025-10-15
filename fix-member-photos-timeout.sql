-- Fix Member Photos Timeout Issues
-- This script addresses RLS policies and performance issues

-- Step 1: Check current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'bla_members';

-- Step 2: Check existing policies on bla_members
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bla_members';

-- Step 3: OPTION A - Disable RLS temporarily (for testing)
-- Uncomment this if you want to disable RLS completely
-- ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Step 4: OPTION B - Add a permissive policy for SELECT (recommended)
-- This allows anonymous users to read all members
DROP POLICY IF EXISTS "Allow public read access to bla_members" ON public.bla_members;

CREATE POLICY "Allow public read access to bla_members"
ON public.bla_members
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 5: Verify the policy was created
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'bla_members' 
  AND policyname = 'Allow public read access to bla_members';

-- Step 6: Test a simple query
SELECT COUNT(*) as total_members FROM public.bla_members;

-- Step 7: Check if there are any slow queries or missing indexes
-- This shows the current index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'bla_members'
ORDER BY idx_scan DESC;

-- Step 8: Add index on id if not exists (should already exist as primary key)
-- CREATE INDEX IF NOT EXISTS idx_bla_members_id ON public.bla_members(id);

-- Step 9: Analyze the table to update statistics
ANALYZE public.bla_members;

-- Success message
SELECT '✅ RLS policy created successfully. Try refreshing the member-photos page now.' as status;

-- =====================================================
-- COPY THIS ENTIRE SCRIPT AND RUN IT IN SUPABASE
-- =====================================================

-- Step 1: Disable RLS on bla_members
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'bla_members';
-- Expected result: rls_enabled should be FALSE

-- Step 3: Test the query
SELECT COUNT(*) as total_members FROM public.bla_members;

-- Step 4: Get sample data
SELECT 
    id,
    full_name,
    town,
    gender,
    member_category,
    photo_url
FROM public.bla_members 
LIMIT 5;

-- If all above queries work, your member-photos page will work too!

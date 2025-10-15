-- EMERGENCY FIX: Disable RLS on bla_members table
-- Use this if the timeout persists even with policies

-- Check current status
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'bla_members';

-- Disable RLS (this allows all read access without policy checks)
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'bla_members';

-- Test query
SELECT COUNT(*) as total_members FROM public.bla_members;
SELECT 
    id, 
    full_name, 
    town, 
    gender, 
    photo_url 
FROM public.bla_members 
LIMIT 5;

-- Success message
SELECT '✅ RLS disabled. The member-photos page should now load instantly.' as status;

-- NOTE: If you need RLS later, you can re-enable it with:
-- ALTER TABLE public.bla_members ENABLE ROW LEVEL SECURITY;
-- Then add appropriate policies

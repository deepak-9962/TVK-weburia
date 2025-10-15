-- Remove ALL RLS policies from bla_members table
-- Run this to completely remove all access restrictions

-- First, let's see what policies exist
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'bla_members';

-- Now drop ALL possible policy names (even if they don't exist, it's safe)
DROP POLICY IF EXISTS "Allow public read access to bla_members" ON public.bla_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bla_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bla_members;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.bla_members;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.bla_members;
DROP POLICY IF EXISTS "anon_read_policy" ON public.bla_members;
DROP POLICY IF EXISTS "authenticated_read_policy" ON public.bla_members;
DROP POLICY IF EXISTS "public_read_policy" ON public.bla_members;
DROP POLICY IF EXISTS "select_policy" ON public.bla_members;
DROP POLICY IF EXISTS "read_policy" ON public.bla_members;

-- If you see policy names in the SELECT above, manually add them here:
-- DROP POLICY IF EXISTS "your_policy_name_here" ON public.bla_members;

-- Disable RLS again to be sure
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Verify everything is clean
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bla_members';
SELECT COUNT(*) as remaining_policies FROM pg_policies WHERE tablename = 'bla_members';

-- Test query
SELECT COUNT(*) as total_members FROM public.bla_members;
SELECT id, full_name FROM public.bla_members LIMIT 5;

-- Should show: rowsecurity = false, remaining_policies = 0

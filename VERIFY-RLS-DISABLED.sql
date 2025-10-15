-- CRITICAL: Verify RLS is completely disabled
-- Run this to double-check

-- Step 1: Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'bla_members';
-- Should show: rowsecurity = false (or f)

-- Step 2: If RLS is still enabled, disable it
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies
DROP POLICY IF EXISTS "Allow public read access to bla_members" ON public.bla_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bla_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bla_members;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.bla_members;

-- Step 4: Verify no policies exist
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'bla_members';
-- Should return 0 rows

-- Step 5: Test direct query
SELECT COUNT(*) FROM public.bla_members;

-- Step 6: Test with all columns
SELECT * FROM public.bla_members LIMIT 5;

-- If all above work, the issue is fixed!

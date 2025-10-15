-- Drop the exact policies that are blocking access

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.bla_members;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.bla_members;

-- Verify they're gone
SELECT COUNT(*) as remaining_policies FROM pg_policies WHERE tablename = 'bla_members';
-- Should show: 0

-- Make sure RLS is disabled
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Verify RLS is off
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bla_members';
-- Should show: rowsecurity = false

-- Test query
SELECT COUNT(*) as total FROM public.bla_members;
SELECT id, full_name, photo_url FROM public.bla_members LIMIT 5;

-- Success!

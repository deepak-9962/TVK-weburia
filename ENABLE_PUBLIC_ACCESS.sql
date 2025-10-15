-- EMERGENCY FIX: Enable policies that allow ALL access
-- This will make queries work immediately

-- Drop all existing policies first
DROP POLICY IF EXISTS "allow_all_select" ON public.bla_members;
DROP POLICY IF EXISTS "allow_all_insert" ON public.bla_members;
DROP POLICY IF EXISTS "allow_all_update" ON public.bla_members;
DROP POLICY IF EXISTS "allow_all_delete" ON public.bla_members;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.bla_members;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.bla_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bla_members;

-- Enable RLS (yes, enable it!)
ALTER TABLE public.bla_members ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow EVERYTHING
CREATE POLICY "public_read_all" ON public.bla_members
    FOR SELECT
    USING (true);

CREATE POLICY "public_insert_all" ON public.bla_members
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "public_update_all" ON public.bla_members
    FOR UPDATE
    USING (true);

CREATE POLICY "public_delete_all" ON public.bla_members
    FOR DELETE
    USING (true);

-- Grant permissions
GRANT ALL ON public.bla_members TO anon;
GRANT ALL ON public.bla_members TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify
SELECT 
    'Policies Created' as status,
    COUNT(*)::text || ' policies' as count
FROM pg_policies 
WHERE tablename = 'bla_members';

-- Test query
SELECT COUNT(*) as total_members FROM public.bla_members;

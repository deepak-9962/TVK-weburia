-- FIXED: Step 1 - Prepare Database for Photo Migration
-- Copy and paste this ENTIRE script into Supabase SQL Editor

-- Part 1: Add backup column
ALTER TABLE public.bla_members 
ADD COLUMN IF NOT EXISTS photo_url_backup TEXT;

-- Part 2: Create storage bucket (or do via UI - easier!)
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Part 3: Drop any existing policies first
DROP POLICY IF EXISTS "Public read access for member photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update member photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete member photos" ON storage.objects;

-- Part 4: Create NEW policies
CREATE POLICY "Public read access for member photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-photos');

CREATE POLICY "Anonymous users can upload member photos"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'member-photos');

CREATE POLICY "Authenticated users can upload member photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-photos');

-- Part 5: Verify setup
SELECT 'Setup verification:' as status;

SELECT 
    '1. Backup column' as check_item,
    CASE WHEN COUNT(*) > 0 THEN '✅ Added' ELSE '❌ Missing' END as status
FROM information_schema.columns
WHERE table_name = 'bla_members' AND column_name = 'photo_url_backup';

SELECT
    '2. Storage bucket' as check_item,
    CASE WHEN COUNT(*) > 0 THEN '✅ Created' ELSE '❌ Missing' END as status
FROM storage.buckets
WHERE name = 'member-photos';

SELECT
    '3. Storage policies' as check_item,
    COUNT(*)::text || ' policies ✅' as status
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%member photos%';

-- Part 6: Show current state
SELECT 
    COUNT(*) as total_members,
    COUNT(*) FILTER (WHERE photo_url LIKE 'data:image%') as base64_photos,
    COUNT(*) FILTER (WHERE photo_url LIKE 'http%') as url_photos
FROM public.bla_members;

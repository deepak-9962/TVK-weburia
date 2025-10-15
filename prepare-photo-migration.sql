-- Prepare database for photo migration
-- Run this in Supabase SQL Editor BEFORE running migration script

-- Step 1: Add backup column for old photo URLs
ALTER TABLE public.bla_members 
ADD COLUMN IF NOT EXISTS photo_url_backup TEXT;

COMMENT ON COLUMN public.bla_members.photo_url_backup IS 'Backup of original base64 photo before migration to Storage';

-- Step 2: Create member-photos storage bucket (if not exists via UI)
-- Note: This is better done via Supabase Dashboard UI
-- But here's the SQL equivalent:

INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create storage policies for member-photos bucket

-- Drop existing policies first (to avoid errors)
DROP POLICY IF EXISTS "Public read access for member photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can upload member photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update member photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete member photos" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for member photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload member photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-photos');

-- Allow anonymous users to upload (for public registration)
CREATE POLICY "Anonymous users can upload member photos"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'member-photos');

-- Allow authenticated users to update their photos
CREATE POLICY "Users can update member photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member-photos');

-- Allow authenticated users to delete photos
CREATE POLICY "Users can delete member photos"  
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-photos');

-- Step 4: Verify setup
SELECT 
    'Backup column added' as status,
    COUNT(*) as members_count
FROM public.bla_members;

SELECT
    'Storage bucket' as status,
    name,
    public as is_public
FROM storage.buckets
WHERE name = 'member-photos';

SELECT
    'Storage policies' as status,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%member photos%';

-- Step 5: Check current photo sizes (to see the problem)
SELECT 
    'Total members' as metric,
    COUNT(*) as value
FROM public.bla_members
UNION ALL
SELECT
    'Members with photos',
    COUNT(*)
FROM public.bla_members
WHERE photo_url IS NOT NULL
UNION ALL
SELECT
    'Members with base64 photos',
    COUNT(*)
FROM public.bla_members
WHERE photo_url LIKE 'data:image%'
UNION ALL
SELECT
    'Average photo size (chars)',
    AVG(LENGTH(photo_url))::bigint
FROM public.bla_members
WHERE photo_url LIKE 'data:image%';

COMMENT ON COLUMN public.bla_members.photo_url IS 'Photo URL - After migration: Storage URL (small), Before: base64 (huge)';

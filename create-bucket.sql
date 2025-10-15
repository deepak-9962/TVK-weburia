-- Create the member-photos bucket via SQL
-- Run this in Supabase SQL Editor

-- First, make sure the bucket doesn't exist
DELETE FROM storage.buckets WHERE id = 'member-photos';

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'member-photos',
  'member-photos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Verify it was created
SELECT * FROM storage.buckets WHERE name = 'member-photos';

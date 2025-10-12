-- Migration: Rename district column to town in bla_members table
-- Date: 2025-10-12
-- Description: Change district to town throughout the database

-- Step 1: Rename the column in bla_members table
ALTER TABLE public.bla_members 
RENAME COLUMN district TO town;

-- Step 2: Update any comments (if they exist)
COMMENT ON COLUMN public.bla_members.town IS 'Town/City of the member';

-- Verification query (run this after migration to verify)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'bla_members' AND column_name = 'town';

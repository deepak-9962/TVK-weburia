-- COMPLETE FIX FOR admin1 LOGIN ISSUE
-- Run this entire script in Supabase SQL Editor

-- Step 1: First, let's check if the is_admin column exists
-- If you get an error here, it means we need to add the column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'employees' AND column_name = 'is_admin';

-- Step 2: Add is_admin column if it doesn't exist
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Step 3: Check if admin1 user exists
SELECT id, username, full_name, is_admin, is_active, 
       LEFT(password_hash, 30) || '...' as password_preview
FROM public.employees 
WHERE username = 'admin1';

-- Step 4: Delete admin1 if it exists (to start fresh)
DELETE FROM public.employees WHERE username = 'admin1';

-- Step 5: Create admin1 user with correct credentials
-- Username: admin1
-- Password: Deepak@9841
-- Hash: abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES (
    'admin1',
    'abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac',
    'deepak',
    true,
    true
);

-- Step 6: Verify the user was created correctly
SELECT id, username, full_name, is_admin, is_active, created_at,
       password_hash
FROM public.employees 
WHERE username = 'admin1';

-- Step 7: Double-check all admin users
SELECT username, full_name, is_admin, is_active
FROM public.employees 
WHERE is_admin = true;

-- EXPECTED RESULTS:
-- You should see admin1 with:
-- - username: admin1
-- - full_name: deepak
-- - is_admin: true (or t)
-- - is_active: true (or t)
-- - password_hash: abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac

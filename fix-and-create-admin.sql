-- Step 1: Add the is_admin column to the employees table
-- This adds the column if it doesn't exist
ALTER TABLE public.employees 
ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Step 2: Verify the column was added
-- You should see is_admin in the list of columns
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- Step 3: Now create your admin user (deepak)
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES (
    'admin1',
    'abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac',
    'deepak',
    true,
    true
)
ON CONFLICT (username) 
DO UPDATE SET 
    password_hash = 'abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac',
    full_name = 'deepak',
    is_admin = true,
    is_active = true;

-- Step 4: Verify the admin user was created successfully
SELECT id, username, full_name, is_admin, is_active, created_at 
FROM public.employees 
WHERE username = 'admin1';

-- Step 5: List all admin users to confirm
SELECT id, username, full_name, is_admin, is_active, created_at 
FROM public.employees 
WHERE is_admin = true
ORDER BY created_at DESC;

-- IMPORTANT: If you get any errors, run each step separately:
-- 1. First run the ALTER TABLE command
-- 2. Then run the INSERT command
-- 3. Finally run the SELECT commands to verify

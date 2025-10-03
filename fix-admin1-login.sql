-- DIAGNOSTIC: Check what's in your database for admin1
SELECT id, username, full_name, is_admin, is_active, 
       LEFT(password_hash, 20) || '...' as password_hash_preview,
       created_at
FROM public.employees 
WHERE username = 'admin1';

-- The hash you created in the password generator was:
-- abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac
-- This is the SHA-256 hash of password: Deepak@9841

-- SOLUTION 1: Update the password hash in database to match your password
-- Run this if you want to use password: Deepak@9841
UPDATE public.employees 
SET password_hash = 'abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac',
    is_admin = true,
    is_active = true
WHERE username = 'admin1';

-- Verify the update worked
SELECT username, full_name, is_admin, is_active,
       password_hash
FROM public.employees 
WHERE username = 'admin1';

-- ALTERNATIVE SOLUTION 2: If password still doesn't work, delete and recreate
-- First, delete the old admin1 user
-- DELETE FROM public.employees WHERE username = 'admin1';

-- Then insert fresh with the correct hash
-- INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
-- VALUES (
--     'admin1',
--     'abee0fd83c5a24e271b9ad783471430f4458f5a5c972d24cf5bfaf1c73d6b2ac',
--     'deepak',
--     true,
--     true
-- );

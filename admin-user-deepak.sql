-- Admin user for Deepak
-- Generated: October 3, 2025
-- Username: admin1
-- Full Name: deepak

-- First, ensure the is_admin column exists
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create the admin user
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

-- Verify the admin user was created
SELECT username, full_name, is_admin, is_active, created_at 
FROM public.employees 
WHERE username = 'admin1';

-- List all admin users
SELECT username, full_name, is_admin, is_active, created_at 
FROM public.employees 
WHERE is_admin = true
ORDER BY created_at DESC;

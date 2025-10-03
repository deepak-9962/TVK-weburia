-- Script to create admin user for TVK BLA system
-- Run this in your Supabase SQL Editor

-- First, update the employees table to add is_admin column if not exists
-- (This is already in database-schema.sql, but just in case)
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create an admin user
-- Password: "admin123" (SHA-256 hash)
-- IMPORTANT: Change this password after first login!

-- The password_hash below is SHA-256 of "admin123"
-- To generate your own hash, use: https://emn178.github.io/online-tools/sha256.html
-- Or in browser console: 
-- const encoder = new TextEncoder();
-- const data = encoder.encode('your_password');
-- crypto.subtle.digest('SHA-256', data).then(hash => {
--   const hashArray = Array.from(new Uint8Array(hash));
--   console.log(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
-- });

INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES (
    'admin',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- SHA-256 of "admin123"
    'System Administrator',
    true,
    true
)
ON CONFLICT (username) 
DO UPDATE SET 
    is_admin = true,
    is_active = true,
    full_name = 'System Administrator';

-- Create another admin user example (optional)
-- Username: tvkadmin, Password: tvk@2024
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES (
    'tvkadmin',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- SHA-256 of "admin"
    'TVK Administrator',
    true,
    true
)
ON CONFLICT (username) 
DO UPDATE SET 
    is_admin = true,
    is_active = true;

-- Verify admin users
SELECT username, full_name, is_admin, is_active, created_at 
FROM public.employees 
WHERE is_admin = true;

-- SECURITY NOTES:
-- 1. Change these default passwords immediately after first login
-- 2. In production, use bcrypt for password hashing (not SHA-256)
-- 3. Consider implementing password expiry and complexity rules
-- 4. Enable Row Level Security (RLS) on employees table:

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Policy: Employees can only read their own data (except admins)
CREATE POLICY "Employees can read own data" ON public.employees
    FOR SELECT
    USING (auth.uid()::text = id::text OR is_admin = true);

-- Policy: Only admins can insert/update employees
CREATE POLICY "Only admins can manage employees" ON public.employees
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.employees 
            WHERE id::text = auth.uid()::text 
            AND is_admin = true
        )
    );

-- To create a new admin user with custom password:
-- 1. Generate SHA-256 hash of your password (use browser console or online tool)
-- 2. Run this query with your values:
/*
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES (
    'your_username',
    'your_sha256_hash',
    'Your Full Name',
    true,
    true
);
*/

-- To promote an existing employee to admin:
/*
UPDATE public.employees 
SET is_admin = true 
WHERE username = 'employee_username';
*/

-- To revoke admin access:
/*
UPDATE public.employees 
SET is_admin = false 
WHERE username = 'username';
*/

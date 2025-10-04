-- SQL Queries to Insert Login Credentials for TVK System
-- Created: October 4, 2025

-- ============================================
-- BLA அலுவலக உள்நுழைவு (BLA Office Login)
-- 10 BLA Employee Credentials
-- ============================================

-- BLA Office Employees (is_admin = false)
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active) VALUES
('bla_employee01', 'password123', 'Employee 1', false, true),
('bla_employee02', 'password123', 'Employee 2', false, true),
('bla_employee03', 'password123', 'Employee 3', false, true),
('bla_employee04', 'password123', 'Employee 4', false, true),
('bla_employee05', 'password123', 'Employee 5', false, true),
('bla_employee06', 'password123', 'Employee 6', false, true),
('bla_employee07', 'password123', 'Employee 7', false, true),
('bla_employee08', 'password123', 'Employee 8', false, true),
('bla_employee09', 'password123', 'Employee 9', false, true),
('bla_employee10', 'password123', 'Employee 10', false, true);

-- ============================================
-- நிர்வாக பேனல் (Admin Panel Access)
-- 3 Admin Credentials
-- ============================================

-- Admin Users (is_admin = true)
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active) VALUES
('admin_tvk01', 'admin@123', 'Admin 1', true, true),
('admin_tvk02', 'admin@123', 'Admin 2', true, true),
('admin_tvk03', 'admin@123', 'Admin 3', true, true);

-- ============================================
-- CREDENTIALS SUMMARY
-- ============================================

/*
==============================================
📋 BLA அலுவலக உள்நுழைவு (BLA Office Login)
==============================================
1. Username: bla_employee01  | Password: password123  | Name: Employee 1
2. Username: bla_employee02  | Password: password123  | Name: Employee 2
3. Username: bla_employee03  | Password: password123  | Name: Employee 3
4. Username: bla_employee04  | Password: password123  | Name: Employee 4
5. Username: bla_employee05  | Password: password123  | Name: Employee 5
6. Username: bla_employee06  | Password: password123  | Name: Employee 6
7. Username: bla_employee07  | Password: password123  | Name: Employee 7
8. Username: bla_employee08  | Password: password123  | Name: Employee 8
9. Username: bla_employee09  | Password: password123  | Name: Employee 9
10. Username: bla_employee10 | Password: password123  | Name: Employee 10

==============================================
🔐 நிர்வாக பேனல் (Admin Panel Access)
==============================================
1. Username: admin_tvk01  | Password: admin@123  | Name: Admin 1
2. Username: admin_tvk02  | Password: admin@123  | Name: Admin 2
3. Username: admin_tvk03  | Password: admin@123  | Name: Admin 3

==============================================
⚠️ IMPORTANT SECURITY NOTES
==============================================
1. These passwords are stored in PLAIN TEXT for development purposes only
2. In production, you MUST hash passwords using bcrypt or similar
3. Change all default passwords immediately after first login
4. Implement password complexity requirements
5. Add two-factor authentication for admin accounts
6. Regular password rotation policy recommended

==============================================
🔧 HOW TO USE
==============================================
1. Execute this SQL file in your Supabase SQL Editor
2. Provide these credentials to respective users
3. Users should change passwords on first login
4. Monitor login activities for security

==============================================
📝 PASSWORD HASHING RECOMMENDATION
==============================================
For production, replace password_hash with properly hashed passwords:

Example with bcrypt (Node.js):
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('password123', 10);

Then update SQL:
UPDATE public.employees 
SET password_hash = '$2b$10$...' 
WHERE username = 'bla_employee01';
*/

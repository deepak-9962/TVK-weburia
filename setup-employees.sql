-- ============================================
-- TVK Employee Setup Script
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing employees table if it exists (to start fresh)
DROP TABLE IF EXISTS public.employees CASCADE;

-- Step 2: Create new employees table with all required columns
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mobile TEXT,
    status TEXT DEFAULT 'active',
    role TEXT DEFAULT 'data_entry',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for employees table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.employees;
CREATE POLICY "Allow all operations for authenticated users"
ON public.employees FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 5: Allow anonymous users to read from employees (for login)
DROP POLICY IF EXISTS "Allow anonymous read for login" ON public.employees;
CREATE POLICY "Allow anonymous read for login"
ON public.employees FOR SELECT
TO anon
USING (true);

-- Step 6: Insert all 100 employees
INSERT INTO public.employees (email, full_name, employee_id, password, status, role)
VALUES 
    ('emp001@madtvk.com', 'emp_1', 'EMP001', 'emp001', 'active', 'data_entry'),
    ('emp002@madtvk.com', 'emp_2', 'EMP002', 'emp002', 'active', 'data_entry'),
    ('emp003@madtvk.com', 'emp_3', 'EMP003', 'emp003', 'active', 'data_entry'),
    ('emp004@madtvk.com', 'emp_4', 'EMP004', 'emp004', 'active', 'data_entry'),
    ('emp005@madtvk.com', 'emp_5', 'EMP005', 'emp005', 'active', 'data_entry'),
    ('emp006@madtvk.com', 'emp_6', 'EMP006', 'emp006', 'active', 'data_entry'),
    ('emp007@madtvk.com', 'emp_7', 'EMP007', 'emp007', 'active', 'data_entry'),
    ('emp008@madtvk.com', 'emp_8', 'EMP008', 'emp008', 'active', 'data_entry'),
    ('emp009@madtvk.com', 'emp_9', 'EMP009', 'emp009', 'active', 'data_entry'),
    ('emp010@madtvk.com', 'emp_10', 'EMP010', 'emp010', 'active', 'data_entry'),
    ('emp011@madtvk.com', 'emp_11', 'EMP011', 'emp011', 'active', 'data_entry'),
    ('emp012@madtvk.com', 'emp_12', 'EMP012', 'emp012', 'active', 'data_entry'),
    ('emp013@madtvk.com', 'emp_13', 'EMP013', 'emp013', 'active', 'data_entry'),
    ('emp014@madtvk.com', 'emp_14', 'EMP014', 'emp014', 'active', 'data_entry'),
    ('emp015@madtvk.com', 'emp_15', 'EMP015', 'emp015', 'active', 'data_entry'),
    ('emp016@madtvk.com', 'emp_16', 'EMP016', 'emp016', 'active', 'data_entry'),
    ('emp017@madtvk.com', 'emp_17', 'EMP017', 'emp017', 'active', 'data_entry'),
    ('emp018@madtvk.com', 'emp_18', 'EMP018', 'emp018', 'active', 'data_entry'),
    ('emp019@madtvk.com', 'emp_19', 'EMP019', 'emp019', 'active', 'data_entry'),
    ('emp020@madtvk.com', 'emp_20', 'EMP020', 'emp020', 'active', 'data_entry'),
    ('emp021@madtvk.com', 'emp_21', 'EMP021', 'emp021', 'active', 'data_entry'),
    ('emp022@madtvk.com', 'emp_22', 'EMP022', 'emp022', 'active', 'data_entry'),
    ('emp023@madtvk.com', 'emp_23', 'EMP023', 'emp023', 'active', 'data_entry'),
    ('emp024@madtvk.com', 'emp_24', 'EMP024', 'emp024', 'active', 'data_entry'),
    ('emp025@madtvk.com', 'emp_25', 'EMP025', 'emp025', 'active', 'data_entry'),
    ('emp026@madtvk.com', 'emp_26', 'EMP026', 'emp026', 'active', 'data_entry'),
    ('emp027@madtvk.com', 'emp_27', 'EMP027', 'emp027', 'active', 'data_entry'),
    ('emp028@madtvk.com', 'emp_28', 'EMP028', 'emp028', 'active', 'data_entry'),
    ('emp029@madtvk.com', 'emp_29', 'EMP029', 'emp029', 'active', 'data_entry'),
    ('emp030@madtvk.com', 'emp_30', 'EMP030', 'emp030', 'active', 'data_entry'),
    ('emp031@madtvk.com', 'emp_31', 'EMP031', 'emp031', 'active', 'data_entry'),
    ('emp032@madtvk.com', 'emp_32', 'EMP032', 'emp032', 'active', 'data_entry'),
    ('emp033@madtvk.com', 'emp_33', 'EMP033', 'emp033', 'active', 'data_entry'),
    ('emp034@madtvk.com', 'emp_34', 'EMP034', 'emp034', 'active', 'data_entry'),
    ('emp035@madtvk.com', 'emp_35', 'EMP035', 'emp035', 'active', 'data_entry'),
    ('emp036@madtvk.com', 'emp_36', 'EMP036', 'emp036', 'active', 'data_entry'),
    ('emp037@madtvk.com', 'emp_37', 'EMP037', 'emp037', 'active', 'data_entry'),
    ('emp038@madtvk.com', 'emp_38', 'EMP038', 'emp038', 'active', 'data_entry'),
    ('emp039@madtvk.com', 'emp_39', 'EMP039', 'emp039', 'active', 'data_entry'),
    ('emp040@madtvk.com', 'emp_40', 'EMP040', 'emp040', 'active', 'data_entry'),
    ('emp041@madtvk.com', 'emp_41', 'EMP041', 'emp041', 'active', 'data_entry'),
    ('emp042@madtvk.com', 'emp_42', 'EMP042', 'emp042', 'active', 'data_entry'),
    ('emp043@madtvk.com', 'emp_43', 'EMP043', 'emp043', 'active', 'data_entry'),
    ('emp044@madtvk.com', 'emp_44', 'EMP044', 'emp044', 'active', 'data_entry'),
    ('emp045@madtvk.com', 'emp_45', 'EMP045', 'emp045', 'active', 'data_entry'),
    ('emp046@madtvk.com', 'emp_46', 'EMP046', 'emp046', 'active', 'data_entry'),
    ('emp047@madtvk.com', 'emp_47', 'EMP047', 'emp047', 'active', 'data_entry'),
    ('emp048@madtvk.com', 'emp_48', 'EMP048', 'emp048', 'active', 'data_entry'),
    ('emp049@madtvk.com', 'emp_49', 'EMP049', 'emp049', 'active', 'data_entry'),
    ('emp050@madtvk.com', 'emp_50', 'EMP050', 'emp050', 'active', 'data_entry'),
    ('emp051@madtvk.com', 'emp_51', 'EMP051', 'emp051', 'active', 'data_entry'),
    ('emp052@madtvk.com', 'emp_52', 'EMP052', 'emp052', 'active', 'data_entry'),
    ('emp053@madtvk.com', 'emp_53', 'EMP053', 'emp053', 'active', 'data_entry'),
    ('emp054@madtvk.com', 'emp_54', 'EMP054', 'emp054', 'active', 'data_entry'),
    ('emp055@madtvk.com', 'emp_55', 'EMP055', 'emp055', 'active', 'data_entry'),
    ('emp056@madtvk.com', 'emp_56', 'EMP056', 'emp056', 'active', 'data_entry'),
    ('emp057@madtvk.com', 'emp_57', 'EMP057', 'emp057', 'active', 'data_entry'),
    ('emp058@madtvk.com', 'emp_58', 'EMP058', 'emp058', 'active', 'data_entry'),
    ('emp059@madtvk.com', 'emp_59', 'EMP059', 'emp059', 'active', 'data_entry'),
    ('emp060@madtvk.com', 'emp_60', 'EMP060', 'emp060', 'active', 'data_entry'),
    ('emp061@madtvk.com', 'emp_61', 'EMP061', 'emp061', 'active', 'data_entry'),
    ('emp062@madtvk.com', 'emp_62', 'EMP062', 'emp062', 'active', 'data_entry'),
    ('emp063@madtvk.com', 'emp_63', 'EMP063', 'emp063', 'active', 'data_entry'),
    ('emp064@madtvk.com', 'emp_64', 'EMP064', 'emp064', 'active', 'data_entry'),
    ('emp065@madtvk.com', 'emp_65', 'EMP065', 'emp065', 'active', 'data_entry'),
    ('emp066@madtvk.com', 'emp_66', 'EMP066', 'emp066', 'active', 'data_entry'),
    ('emp067@madtvk.com', 'emp_67', 'EMP067', 'emp067', 'active', 'data_entry'),
    ('emp068@madtvk.com', 'emp_68', 'EMP068', 'emp068', 'active', 'data_entry'),
    ('emp069@madtvk.com', 'emp_69', 'EMP069', 'emp069', 'active', 'data_entry'),
    ('emp070@madtvk.com', 'emp_70', 'EMP070', 'emp070', 'active', 'data_entry'),
    ('emp071@madtvk.com', 'emp_71', 'EMP071', 'emp071', 'active', 'data_entry'),
    ('emp072@madtvk.com', 'emp_72', 'EMP072', 'emp072', 'active', 'data_entry'),
    ('emp073@madtvk.com', 'emp_73', 'EMP073', 'emp073', 'active', 'data_entry'),
    ('emp074@madtvk.com', 'emp_74', 'EMP074', 'emp074', 'active', 'data_entry'),
    ('emp075@madtvk.com', 'emp_75', 'EMP075', 'emp075', 'active', 'data_entry'),
    ('emp076@madtvk.com', 'emp_76', 'EMP076', 'emp076', 'active', 'data_entry'),
    ('emp077@madtvk.com', 'emp_77', 'EMP077', 'emp077', 'active', 'data_entry'),
    ('emp078@madtvk.com', 'emp_78', 'EMP078', 'emp078', 'active', 'data_entry'),
    ('emp079@madtvk.com', 'emp_79', 'EMP079', 'emp079', 'active', 'data_entry'),
    ('emp080@madtvk.com', 'emp_80', 'EMP080', 'emp080', 'active', 'data_entry'),
    ('emp081@madtvk.com', 'emp_81', 'EMP081', 'emp081', 'active', 'data_entry'),
    ('emp082@madtvk.com', 'emp_82', 'EMP082', 'emp082', 'active', 'data_entry'),
    ('emp083@madtvk.com', 'emp_83', 'EMP083', 'emp083', 'active', 'data_entry'),
    ('emp084@madtvk.com', 'emp_84', 'EMP084', 'emp084', 'active', 'data_entry'),
    ('emp085@madtvk.com', 'emp_85', 'EMP085', 'emp085', 'active', 'data_entry'),
    ('emp086@madtvk.com', 'emp_86', 'EMP086', 'emp086', 'active', 'data_entry'),
    ('emp087@madtvk.com', 'emp_87', 'EMP087', 'emp087', 'active', 'data_entry'),
    ('emp088@madtvk.com', 'emp_88', 'EMP088', 'emp088', 'active', 'data_entry'),
    ('emp089@madtvk.com', 'emp_89', 'EMP089', 'emp089', 'active', 'data_entry'),
    ('emp090@madtvk.com', 'emp_90', 'EMP090', 'emp090', 'active', 'data_entry'),
    ('emp091@madtvk.com', 'emp_91', 'EMP091', 'emp091', 'active', 'data_entry'),
    ('emp092@madtvk.com', 'emp_92', 'EMP092', 'emp092', 'active', 'data_entry'),
    ('emp093@madtvk.com', 'emp_93', 'EMP093', 'emp093', 'active', 'data_entry'),
    ('emp094@madtvk.com', 'emp_94', 'EMP094', 'emp094', 'active', 'data_entry'),
    ('emp095@madtvk.com', 'emp_95', 'EMP095', 'emp095', 'active', 'data_entry'),
    ('emp096@madtvk.com', 'emp_96', 'EMP096', 'emp096', 'active', 'data_entry'),
    ('emp097@madtvk.com', 'emp_97', 'EMP097', 'emp097', 'active', 'data_entry'),
    ('emp098@madtvk.com', 'emp_98', 'EMP098', 'emp098', 'active', 'data_entry'),
    ('emp099@madtvk.com', 'emp_99', 'EMP099', 'emp099', 'active', 'data_entry'),
    ('emp100@madtvk.com', 'emp_100', 'EMP100', 'emp100', 'active', 'data_entry');

-- Step 7: Create admins table
DROP TABLE IF EXISTS public.admins CASCADE;

CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.admins;
CREATE POLICY "Allow all operations for authenticated users"
ON public.admins FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow anonymous users to read from admins (for login)
DROP POLICY IF EXISTS "Allow anonymous read for login" ON public.admins;
CREATE POLICY "Allow anonymous read for login"
ON public.admins FOR SELECT
TO anon
USING (true);

-- Step 8: Insert admin users
INSERT INTO public.admins (username, password, full_name, email, role, status)
VALUES 
    ('admin', 'admin123', 'Admin User', 'admin@madtvk.com', 'super_admin', 'active'),
    ('admin1', 'admin1', 'Administrator 1', 'admin1@madtvk.com', 'admin', 'active'),
    ('admin2', 'admin2', 'Administrator 2', 'admin2@madtvk.com', 'admin', 'active'),
    ('admin3', 'admin3', 'Administrator 3', 'admin3@madtvk.com', 'admin', 'active'),
    ('superadmin', 'super123', 'Super Administrator', 'superadmin@madtvk.com', 'super_admin', 'active');

-- Step 9: Verify the employee insert
SELECT id, email, full_name, employee_id, password, status, created_at 
FROM public.employees 
ORDER BY employee_id ASC
LIMIT 10;

-- Step 10: Verify the admin insert
SELECT id, username, full_name, email, role, status, created_at 
FROM public.admins 
ORDER BY created_at ASC;

-- Step 11: Check if any members already have employee tracking
SELECT 
    COUNT(*) as total_members,
    COUNT(registered_by_employee_id) as members_with_employee_tracking
FROM public.bla_members;

-- Step 12: Create a view for employee performance (optional but helpful)
CREATE OR REPLACE VIEW public.employee_performance AS
SELECT 
    e.id,
    e.employee_id,
    e.full_name,
    e.email,
    e.status,
    COUNT(m.id) as total_members_registered,
    COUNT(CASE WHEN m.status = 'active' THEN 1 END) as active_members,
    COUNT(CASE WHEN m.status = 'pending' THEN 1 END) as pending_members,
    COUNT(CASE WHEN m.created_at::date = CURRENT_DATE THEN 1 END) as today_registrations,
    MAX(m.created_at) as last_registration_date,
    MIN(m.created_at) as first_registration_date
FROM public.employees e
LEFT JOIN public.bla_members m ON m.registered_by_employee_id = e.id
GROUP BY e.id, e.employee_id, e.full_name, e.email, e.status
ORDER BY total_members_registered DESC;

-- Step 13: Query the views
SELECT * FROM public.employee_performance LIMIT 10;

-- Step 14: Show all admins
SELECT username, full_name, email, role, status FROM public.admins;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. This script DROPS and recreates the employees and admins tables
--    WARNING: This will delete any existing employee/admin data!
--
-- 2. EMPLOYEE LOGIN:
--    Passwords are stored directly in the employees table
--    Each employee can login with their email and password
--    
--    Password format is simple: emp001, emp002, emp003, etc.
--    Example logins:
--    - Email: emp001@madtvk.com | Password: emp001
--    - Email: emp002@madtvk.com | Password: emp002
--    - Email: emp050@madtvk.com | Password: emp050
--
-- 3. ADMIN LOGIN:
--    Admins use username and password
--    Default admin accounts:
--    - Username: admin     | Password: admin123 (Super Admin)
--    - Username: admin1    | Password: admin1
--    - Username: admin2    | Password: admin2
--    - Username: admin3    | Password: admin3
--    - Username: superadmin | Password: super123 (Super Admin)
--
-- 4. You can change passwords directly in the database
--    or via the employee/admin management interface
--
-- 5. NO Supabase Auth required - simple username/email + password matching
--
-- 6. Anonymous access is allowed for SELECT (needed for login)
--
-- 7. SECURITY WARNING: Change default passwords in production!
-- ============================================

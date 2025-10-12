# Employee Tracking System - Complete Guide

## 🎯 System Overview

Your TVK BLA registration system **ALREADY HAS** employee tracking built-in! Every member registered is automatically linked to the employee who created them.

## 📋 How It Works

### 1. Employee Login Process
- **File**: `employee-login.html`
- Employees log in with their **email** and **password**
- Session is stored in `sessionStorage` with employee ID
- Redirects to `employee-dashboard.html` after successful login

### 2. Member Registration Tracking
- **File**: `bla-office-entry.js`
- When an employee registers a member, the system automatically:
  - Retrieves employee ID from session (`bla_employee_session`)
  - Saves it in the `registered_by_employee_id` field
  - Links the member to that employee permanently

### 3. Database Field
- **Table**: `bla_members`
- **Column**: `registered_by_employee_id` (UUID)
- **References**: `employees.id`
- Automatically populated on every member registration

## 🔐 Employee Login Credentials

### How to Set Up Employee Accounts:

#### Option 1: Using Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter:
   - **Email**: employee1@tvk.com
   - **Password**: (set a secure password)
4. Go to SQL Editor and run:
   ```sql
   INSERT INTO employees (id, email, full_name, employee_id, password_hash, status)
   VALUES (
     '(user-id-from-auth)',  -- Get this from auth.users table
     'employee1@tvk.com',
     'Employee Name',
     'EMP001',
     '(auto-generated)',
     'active'
   );
   ```

#### Option 2: Using Admin Panel (Recommended)
1. Login as admin
2. Go to Employee Management section
3. Click "Add New Employee"
4. Fill in details:
   - Full Name
   - Email
   - Employee ID (e.g., EMP001)
   - Password
5. System automatically creates:
   - Auth user in `auth.users`
   - Employee record in `employees` table

## 👥 Creating Multiple Employees

### Example Employee Accounts:

```
Employee 1:
Email: emp001@tvk.com
Password: TVK@2025!Emp1
Employee ID: EMP001

Employee 2:
Email: emp002@tvk.com
Password: TVK@2025!Emp2
Employee ID: EMP002

Employee 3:
Email: emp003@tvk.com
Password: TVK@2025!Emp3
Employee ID: EMP003
```

### SQL Script to Create Employees:
```sql
-- First, create auth users in Supabase Dashboard
-- Then run this to add employee records:

INSERT INTO employees (email, full_name, employee_id, mobile, status, role)
VALUES 
('emp001@tvk.com', 'Rajesh Kumar', 'EMP001', '9876543210', 'active', 'data_entry'),
('emp002@tvk.com', 'Priya Devi', 'EMP002', '9876543211', 'active', 'data_entry'),
('emp003@tvk.com', 'Karthik Raja', 'EMP003', '9876543212', 'active', 'data_entry');
```

## 📊 Tracking Employee Performance

### Data Available:
- **registered_by_employee_id**: Links each member to the employee who registered them
- **created_at**: Timestamp of when member was registered
- **employee info**: Name, email, ID from `employees` table

### Query to See Employee Performance:
```sql
SELECT 
    e.employee_id,
    e.full_name,
    e.email,
    COUNT(m.id) as total_members_registered,
    COUNT(CASE WHEN m.status = 'active' THEN 1 END) as active_members,
    MIN(m.created_at) as first_registration,
    MAX(m.created_at) as latest_registration
FROM employees e
LEFT JOIN bla_members m ON m.registered_by_employee_id = e.id
GROUP BY e.id, e.employee_id, e.full_name, e.email
ORDER BY total_members_registered DESC;
```

## 🖥️ Admin Reports

### Viewing Employee Performance:
I'm creating a new admin report page that shows:
1. **Employee List** with registration counts
2. **Daily/Weekly/Monthly stats** per employee
3. **Export to Excel** functionality
4. **Detailed member list** per employee

## 🔄 Current Workflow

```
1. Employee logs in via employee-login.html
   ↓
2. Session stored with employee_id in sessionStorage
   ↓
3. Employee fills BLA registration form (bla-office-entry.html)
   ↓
4. On submit, bla-office-entry.js gets employee_id from session
   ↓
5. Member saved with registered_by_employee_id field populated
   ↓
6. Admin can view reports showing which employee registered which members
```

## ✅ What's Already Working

- ✅ Employee authentication system
- ✅ Session management
- ✅ Auto-tracking of employee ID on member registration
- ✅ Database field `registered_by_employee_id` properly populated
- ✅ Employee info joined with member data

## 🆕 What I'm Adding Now

- 🔄 Employee Performance Report page for admin
- 🔄 Visual dashboard showing employee statistics
- 🔄 Excel export of employee performance
- 🔄 Filter by date range, employee, etc.

## 📱 Access URLs

- **Employee Login**: `employee-login.html`
- **Employee Dashboard**: `employee-dashboard.html`
- **BLA Registration Form**: `bla-office-entry.html`
- **Admin Dashboard**: `admin-dashboard.html`
- **Employee Report** (NEW): `admin-employee-report.html`

## 🔐 Security Notes

1. **Session-based**: Employee session stored in sessionStorage
2. **Auto-logout**: Sessions expire when browser is closed
3. **Protected routes**: Pages check for valid session before loading
4. **Database-level**: Employee ID saved at database level, cannot be modified

## 🎓 Training Employees

Tell your employees:
1. Go to `employee-login.html`
2. Enter their email (e.g., emp001@tvk.com)
3. Enter their password
4. They'll see the employee dashboard
5. Click "Office Activities" to register members
6. Every member they register is automatically tracked to them

---

**Status**: ✅ Employee tracking is ALREADY working!
**Next Step**: I'm now creating the admin report page to VIEW the tracking data.

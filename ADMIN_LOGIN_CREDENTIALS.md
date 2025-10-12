# 🔐 Admin Login Credentials

## Admin Authentication System

Your admin login now uses **simple username and password matching** directly from the database - NO Supabase Auth required!

---

## 👑 Default Admin Accounts

### Super Admin Accounts:

| Username | Password | Full Name | Role | Email |
|----------|----------|-----------|------|-------|
| **admin** | admin123 | Admin User | super_admin | admin@madtvk.com |
| **superadmin** | super123 | Super Administrator | super_admin | superadmin@madtvk.com |

### Regular Admin Accounts:

| Username | Password | Full Name | Role | Email |
|----------|----------|-----------|------|-------|
| **admin1** | admin1 | Administrator 1 | admin | admin1@madtvk.com |
| **admin2** | admin2 | Administrator 2 | admin | admin2@madtvk.com |
| **admin3** | admin3 | Administrator 3 | admin | admin3@madtvk.com |

---

## 🎯 How to Login as Admin:

### Step 1: Open Admin Login Page
Go to: `admin-login.html`

### Step 2: Enter Credentials
- **Username**: admin
- **Password**: admin123

### Step 3: Click Login
You'll be redirected to the admin dashboard

---

## 📊 Admin vs Employee Login

### Admin Login:
- **URL**: admin-login.html
- **Uses**: Username + Password
- **Table**: `admins`
- **Format**: 
  - Username: admin, admin1, admin2, etc.
  - Password: admin123, admin1, admin2, etc.

### Employee Login:
- **URL**: employee-login.html
- **Uses**: Email + Password  
- **Table**: `employees`
- **Format**:
  - Email: emp001@madtvk.com
  - Password: emp001

---

## 🔐 Admin Roles

### Super Admin (`super_admin`):
- Full system access
- Can manage all employees
- Can manage other admins
- Access to all reports and data
- Can change system settings

**Accounts**: `admin`, `superadmin`

### Regular Admin (`admin`):
- Can view all members
- Can export data
- Can view reports
- Can manage employees
- Limited system settings access

**Accounts**: `admin1`, `admin2`, `admin3`

---

## 🚀 Quick Test:

### Test Admin Login:
```
URL: admin-login.html
Username: admin
Password: admin123
Expected: Redirect to admin-dashboard.html
```

### Test Employee Login:
```
URL: employee-login.html
Email: emp001@madtvk.com
Password: emp001
Expected: Redirect to employee-dashboard.html
```

---

## 🛠️ Setup Instructions:

### Run the SQL Script:
1. Open Supabase SQL Editor
2. Paste the entire `setup-employees.sql` file
3. Click **Run**
4. This creates both `employees` and `admins` tables

### Verify Setup:
```sql
-- Check admins table
SELECT * FROM public.admins;

-- Should show 5 admin accounts:
-- admin, admin1, admin2, admin3, superadmin
```

---

## 🔧 Database Schema

### `admins` Table:
```sql
CREATE TABLE public.admins (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',        -- 'admin' or 'super_admin'
    status TEXT DEFAULT 'active',     -- 'active' or 'inactive'
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Key Fields:
- **username**: Unique identifier for login (admin, admin1, etc.)
- **password**: Plain text password (change in production!)
- **role**: Determines access level (admin vs super_admin)
- **status**: Must be 'active' to allow login

---

## 🔒 Password Management

### Change Admin Password:

**Via SQL:**
```sql
UPDATE public.admins 
SET password = 'newpassword123' 
WHERE username = 'admin';
```

**Via Admin Panel:**
1. Login as super admin
2. Go to Employee Management (will add admin management later)
3. Edit admin account
4. Change password
5. Save

### Best Practices:
- ⚠️ **Change default passwords immediately in production!**
- Use strong passwords (min 8 characters)
- Include uppercase, lowercase, numbers, special characters
- Don't share admin credentials
- Use unique passwords for each admin

---

## 📝 Adding New Admin:

### Via SQL:
```sql
INSERT INTO public.admins (username, password, full_name, email, role, status)
VALUES ('admin4', 'SecurePass123!', 'Administrator 4', 'admin4@madtvk.com', 'admin', 'active');
```

### Via Admin Panel (Future Feature):
Will be added to employee management interface

---

## 🔐 Security Features

### Row Level Security (RLS):
- ✅ Enabled on both `admins` and `employees` tables
- ✅ Anonymous users can SELECT (needed for login)
- ✅ Authenticated users have full access
- ✅ Protects data from unauthorized access

### Login Validation:
```javascript
// Admin login checks:
1. Username exists in admins table
2. Password matches exactly
3. Status is 'active'
4. All three must pass to login
```

### Session Management:
```javascript
// Admin session stored in sessionStorage:
{
    id: "uuid-here",
    username: "admin",
    full_name: "Admin User",
    email: "admin@madtvk.com",
    role: "super_admin",
    is_admin: true,
    login_time: "2025-10-12T10:30:00.000Z"
}
```

---

## ⚠️ Security Warnings

### 🚨 CRITICAL - Production Deployment:

1. **Change ALL Default Passwords!**
   ```sql
   UPDATE public.admins SET password = 'YourSecurePassword123!' WHERE username = 'admin';
   UPDATE public.admins SET password = 'AnotherSecurePass456!' WHERE username = 'admin1';
   -- etc.
   ```

2. **Consider Password Hashing:**
   - Current: Plain text passwords (easy but insecure)
   - Recommended: Hash passwords with bcrypt or similar
   - Would require updating login logic

3. **Use HTTPS Only:**
   - Never use HTTP for login pages
   - Passwords transmitted in plain text over HTTP
   - Always use SSL/TLS certificates

4. **Limit Failed Login Attempts:**
   - Add rate limiting
   - Block IP after 5 failed attempts
   - Add CAPTCHA for security

5. **Session Timeout:**
   - Add automatic logout after inactivity
   - Clear session on browser close
   - Implement "Remember Me" carefully

---

## 🧪 Testing Checklist:

- [ ] SQL script runs without errors
- [ ] `admins` table has 5 records
- [ ] `employees` table has 100 records
- [ ] Can login with username: admin / password: admin123
- [ ] Redirects to admin-dashboard.html after login
- [ ] Session stored in sessionStorage
- [ ] Can access admin features
- [ ] Can logout successfully
- [ ] Cannot login with wrong password
- [ ] Cannot login with inactive account

---

## 📱 Mobile Access:

All admin accounts work on mobile devices:
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Same credentials work on mobile
- ✅ Session persists across refreshes

---

## 🔄 Migration from Old System:

If you had admins in the old `employees` table:

```sql
-- Backup old admin data first!
SELECT * FROM employees WHERE is_admin = true;

-- Then run the new setup script
-- It will create separate admins table
```

---

## 📞 Common Issues & Solutions:

### Issue: "Invalid username or password"
**Solution:**
1. Check username is exact (case-sensitive)
2. Check password is exact (no extra spaces)
3. Verify account status is 'active'
4. Run: `SELECT * FROM admins WHERE username = 'admin';`

### Issue: "Page won't redirect after login"
**Solution:**
1. Check browser console for errors
2. Verify `admin-dashboard.html` exists
3. Check sessionStorage has `tvk_admin_user`
4. Clear browser cache and try again

### Issue: "Cannot access admin features"
**Solution:**
1. Check session: `sessionStorage.getItem('tvk_admin_user')`
2. Verify `is_admin: true` in session
3. Re-login to refresh session
4. Check role is 'admin' or 'super_admin'

---

## 🎉 Quick Summary:

### 5 Admin Accounts Ready:
1. **admin** / admin123 (Super Admin) ⭐
2. **admin1** / admin1
3. **admin2** / admin2
4. **admin3** / admin3
5. **superadmin** / super123 (Super Admin) ⭐

### Login Steps:
1. Go to admin-login.html
2. Enter username and password
3. Click login
4. Access admin dashboard

### Security:
- ⚠️ Change passwords in production!
- ✅ Simple username/password system
- ✅ Direct database authentication
- ✅ No Supabase Auth needed

---

## 📚 Related Documentation:

- **Employee Credentials**: See `EMPLOYEE_LOGIN_CREDENTIALS.md`
- **Setup Guide**: See `COMPLETE_EMPLOYEE_SETUP.md`
- **SQL Script**: See `setup-employees.sql`

---

**Ready to use! Just run the SQL script and login with admin/admin123** 🚀

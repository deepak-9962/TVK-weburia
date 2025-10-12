# 🔐 Complete Login System - Quick Reference

## Two Separate Login Systems

### 👑 ADMIN LOGIN
**URL**: `admin-login.html`  
**Database Table**: `admins`  
**Credentials Format**: Username + Password

### 👤 EMPLOYEE LOGIN
**URL**: `employee-login.html`  
**Database Table**: `employees`  
**Credentials Format**: Email + Password

---

## 👑 Admin Accounts (5 Total)

| # | Username | Password | Role | Use For |
|---|----------|----------|------|---------|
| 1 | **admin** | admin123 | Super Admin | Main administrator |
| 2 | **superadmin** | super123 | Super Admin | Backup admin account |
| 3 | **admin1** | admin1 | Admin | Regular admin 1 |
| 4 | **admin2** | admin2 | Admin | Regular admin 2 |
| 5 | **admin3** | admin3 | Admin | Regular admin 3 |

### Admin Login Example:
```
Go to: admin-login.html
Username: admin
Password: admin123
```

---

## 👤 Employee Accounts (100 Total)

**Pattern**: emp001@madtvk.com / emp001

| # | Email | Password | Name |
|---|-------|----------|------|
| 1 | emp001@madtvk.com | emp001 | emp_1 |
| 2 | emp002@madtvk.com | emp002 | emp_2 |
| 3 | emp003@madtvk.com | emp003 | emp_3 |
| ... | ... | ... | ... |
| 100 | emp100@madtvk.com | emp100 | emp_100 |

### Employee Login Example:
```
Go to: employee-login.html
Email: emp001@madtvk.com
Password: emp001
```

---

## 🚀 Quick Setup (One-Time)

### Step 1: Run SQL Script
```sql
-- Open Supabase SQL Editor
-- Paste and run: setup-employees.sql
-- Creates both admins and employees tables
-- Inserts 5 admins + 100 employees
```

### Step 2: Test Admin Login
```
URL: admin-login.html
Username: admin
Password: admin123
Expected: Redirect to admin dashboard
```

### Step 3: Test Employee Login
```
URL: employee-login.html
Email: emp001@madtvk.com
Password: emp001
Expected: Redirect to employee dashboard
```

---

## 📊 Feature Comparison

| Feature | Admin | Employee |
|---------|-------|----------|
| **Login Page** | admin-login.html | employee-login.html |
| **Dashboard** | admin-dashboard.html | employee-dashboard.html |
| **View All Members** | ✅ Yes | ❌ No |
| **Register Members** | ❌ No | ✅ Yes |
| **Export Data** | ✅ Yes | ❌ No |
| **View Reports** | ✅ Yes | ❌ No |
| **Manage Employees** | ✅ Yes | ❌ No |
| **Tracking** | Views all | Gets tracked |

---

## 🎯 Common Use Cases

### Use Case 1: Admin Views Performance
```
1. Admin logs in (admin/admin123)
2. Opens "Employee Performance Report"
3. Sees all 100 employees
4. Clicks on emp_1
5. Views all members registered by emp_1
6. Exports to Excel
```

### Use Case 2: Employee Registers Member
```
1. Employee logs in (emp001@madtvk.com/emp001)
2. Opens "Office Activities"
3. Fills BLA registration form
4. Submits member details
5. System automatically tags member with employee ID
6. Admin can see this in reports
```

### Use Case 3: Admin Exports Data
```
1. Admin logs in
2. Opens admin dashboard
3. Applies filters (town, gender, date range)
4. Clicks "Export to Excel"
5. Downloads complete member list
```

---

## 🔐 Security Notes

### ⚠️ IMPORTANT - Production Deployment:

1. **Change Admin Passwords:**
   ```sql
   UPDATE admins SET password = 'YourSecurePass!' WHERE username = 'admin';
   ```

2. **Use HTTPS Only:**
   - Never transmit passwords over HTTP
   - Always use SSL/TLS certificates

3. **Limit Access:**
   - Don't share admin credentials
   - Give employees only their own credentials
   - Deactivate unused accounts

4. **Monitor Activity:**
   - Check employee performance reports
   - Review login times
   - Track member registrations

---

## 📱 Print-Friendly Credentials

### For Admins (Print & Keep Secure):
```
┌───────────────────────────────────┐
│    TVK ADMIN CREDENTIALS          │
├───────────────────────────────────┤
│                                   │
│  Main Admin:                      │
│  Username: admin                  │
│  Password: admin123               │
│                                   │
│  Backup Admin:                    │
│  Username: superadmin             │
│  Password: super123               │
│                                   │
│  Login at: admin-login.html       │
└───────────────────────────────────┘
```

### For Employees (Print & Distribute):
```
┌───────────────────────────────────┐
│    TVK EMPLOYEE LOGIN             │
├───────────────────────────────────┤
│                                   │
│  Your Employee Number: ___        │
│                                   │
│  Email: emp___@madtvk.com        │
│         (fill your 3-digit #)     │
│                                   │
│  Password: emp___                 │
│           (same 3-digit #)        │
│                                   │
│  Example:                         │
│  Email: emp001@madtvk.com        │
│  Password: emp001                 │
│                                   │
│  Login at: employee-login.html    │
└───────────────────────────────────┘
```

---

## 🧪 Testing Checklist

### Database Setup:
- [ ] SQL script ran successfully
- [ ] `admins` table has 5 records
- [ ] `employees` table has 100 records
- [ ] Row Level Security enabled
- [ ] Policies created for both tables

### Admin Login:
- [ ] Can login with admin/admin123
- [ ] Redirects to admin dashboard
- [ ] Can access all features
- [ ] Can view employee reports
- [ ] Can export data
- [ ] Can manage employees

### Employee Login:
- [ ] Can login with emp001@madtvk.com/emp001
- [ ] Redirects to employee dashboard
- [ ] Can access office activities
- [ ] Can register members
- [ ] Member gets tagged with employee ID
- [ ] Cannot access admin features

### Integration:
- [ ] Admin can see employee-registered members
- [ ] Performance report shows correct counts
- [ ] Excel export includes all data
- [ ] Filters work correctly
- [ ] Session persists across refreshes
- [ ] Logout works properly

---

## 🔄 Password Reset Guide

### For Admins (Reset via SQL):
```sql
-- Reset admin password
UPDATE admins 
SET password = 'newpassword123' 
WHERE username = 'admin';

-- Verify change
SELECT username, password, status FROM admins WHERE username = 'admin';
```

### For Employees (Reset via SQL):
```sql
-- Reset employee password
UPDATE employees 
SET password = 'newpass001' 
WHERE employee_id = 'EMP001';

-- Verify change
SELECT employee_id, email, password, status FROM employees WHERE employee_id = 'EMP001';
```

### Future: Admin Panel Reset
Will add password reset feature in admin employee management interface.

---

## 📞 Support & Troubleshooting

### Can't Login?
1. **Check credentials are exact** (case-sensitive)
2. **Verify account status is 'active'**
3. **Clear browser cache**
4. **Check browser console for errors**
5. **Verify Supabase connection**

### Admin Shows Wrong Data?
1. **Check filters are cleared**
2. **Verify date range includes data**
3. **Check database has member records**
4. **Refresh the page**

### Employee Can't Register?
1. **Verify employee is logged in**
2. **Check all required fields filled**
3. **Verify internet connection**
4. **Check Supabase API is working**

---

## 📚 Related Files

- **SQL Setup**: `setup-employees.sql`
- **Admin Guide**: `ADMIN_LOGIN_CREDENTIALS.md`
- **Employee Guide**: `EMPLOYEE_LOGIN_CREDENTIALS.md`
- **Complete Setup**: `COMPLETE_EMPLOYEE_SETUP.md`
- **Admin Login**: `admin-login.html`
- **Employee Login**: `employee-login.html`
- **Admin Auth**: `admin-login.html` (inline script)
- **Employee Auth**: `employee-auth.js`

---

## 🎉 Summary

### What You Get:
✅ **5 admin accounts** (2 super admins + 3 regular admins)  
✅ **100 employee accounts** (emp_1 through emp_100)  
✅ **Simple password system** (no Supabase Auth needed)  
✅ **Complete tracking** (who registered which member)  
✅ **Full reports** (employee performance & member data)  
✅ **Easy management** (via admin dashboard)

### How to Start:
1. **Run SQL script** → Creates all accounts
2. **Test admin login** → admin/admin123
3. **Test employee login** → emp001@madtvk.com/emp001
4. **Distribute credentials** → Give employees their numbers
5. **Monitor activity** → Use admin reports

---

## 🔒 Remember:

- ⚠️ **Change default admin passwords in production!**
- 🔐 **Keep admin credentials secure**
- 👥 **Give employees only their own credentials**
- 📊 **Monitor employee performance regularly**
- 🔄 **Deactivate unused accounts**

---

**Ready to deploy! Run the SQL script and start using both admin and employee systems.** 🚀

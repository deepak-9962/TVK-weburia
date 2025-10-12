# 🔐 Employee Login Credentials

## Simple Password System

Your employee login now uses **simple email and password matching** directly from the database - NO Supabase Auth required!

---

## 📋 Complete Employee List (1-100)

### Login Format:
- **Email**: `empXXX@madtvk.com`
- **Password**: `empXXX`

Where `XXX` is the employee number with leading zeros (001, 002, 003, etc.)

---

## 🎯 Example Logins:

| Employee | Email | Password |
|----------|-------|----------|
| emp_1 | emp001@madtvk.com | emp001 |
| emp_2 | emp002@madtvk.com | emp002 |
| emp_3 | emp003@madtvk.com | emp003 |
| emp_4 | emp004@madtvk.com | emp004 |
| emp_5 | emp005@madtvk.com | emp005 |
| emp_10 | emp010@madtvk.com | emp010 |
| emp_25 | emp025@madtvk.com | emp025 |
| emp_50 | emp050@madtvk.com | emp050 |
| emp_99 | emp099@madtvk.com | emp099 |
| emp_100 | emp100@madtvk.com | emp100 |

---

## 📝 All 100 Employees:

### emp001 - emp010
- emp001@madtvk.com / emp001
- emp002@madtvk.com / emp002
- emp003@madtvk.com / emp003
- emp004@madtvk.com / emp004
- emp005@madtvk.com / emp005
- emp006@madtvk.com / emp006
- emp007@madtvk.com / emp007
- emp008@madtvk.com / emp008
- emp009@madtvk.com / emp009
- emp010@madtvk.com / emp010

### emp011 - emp020
- emp011@madtvk.com / emp011
- emp012@madtvk.com / emp012
- emp013@madtvk.com / emp013
- emp014@madtvk.com / emp014
- emp015@madtvk.com / emp015
- emp016@madtvk.com / emp016
- emp017@madtvk.com / emp017
- emp018@madtvk.com / emp018
- emp019@madtvk.com / emp019
- emp020@madtvk.com / emp020

### emp021 - emp030
- emp021@madtvk.com / emp021
- emp022@madtvk.com / emp022
- emp023@madtvk.com / emp023
- emp024@madtvk.com / emp024
- emp025@madtvk.com / emp025
- emp026@madtvk.com / emp026
- emp027@madtvk.com / emp027
- emp028@madtvk.com / emp028
- emp029@madtvk.com / emp029
- emp030@madtvk.com / emp030

### emp031 - emp040
- emp031@madtvk.com / emp031
- emp032@madtvk.com / emp032
- emp033@madtvk.com / emp033
- emp034@madtvk.com / emp034
- emp035@madtvk.com / emp035
- emp036@madtvk.com / emp036
- emp037@madtvk.com / emp037
- emp038@madtvk.com / emp038
- emp039@madtvk.com / emp039
- emp040@madtvk.com / emp040

### emp041 - emp050
- emp041@madtvk.com / emp041
- emp042@madtvk.com / emp042
- emp043@madtvk.com / emp043
- emp044@madtvk.com / emp044
- emp045@madtvk.com / emp045
- emp046@madtvk.com / emp046
- emp047@madtvk.com / emp047
- emp048@madtvk.com / emp048
- emp049@madtvk.com / emp049
- emp050@madtvk.com / emp050

### emp051 - emp060
- emp051@madtvk.com / emp051
- emp052@madtvk.com / emp052
- emp053@madtvk.com / emp053
- emp054@madtvk.com / emp054
- emp055@madtvk.com / emp055
- emp056@madtvk.com / emp056
- emp057@madtvk.com / emp057
- emp058@madtvk.com / emp058
- emp059@madtvk.com / emp059
- emp060@madtvk.com / emp060

### emp061 - emp070
- emp061@madtvk.com / emp061
- emp062@madtvk.com / emp062
- emp063@madtvk.com / emp063
- emp064@madtvk.com / emp064
- emp065@madtvk.com / emp065
- emp066@madtvk.com / emp066
- emp067@madtvk.com / emp067
- emp068@madtvk.com / emp068
- emp069@madtvk.com / emp069
- emp070@madtvk.com / emp070

### emp071 - emp080
- emp071@madtvk.com / emp071
- emp072@madtvk.com / emp072
- emp073@madtvk.com / emp073
- emp074@madtvk.com / emp074
- emp075@madtvk.com / emp075
- emp076@madtvk.com / emp076
- emp077@madtvk.com / emp077
- emp078@madtvk.com / emp078
- emp079@madtvk.com / emp079
- emp080@madtvk.com / emp080

### emp081 - emp090
- emp081@madtvk.com / emp081
- emp082@madtvk.com / emp082
- emp083@madtvk.com / emp083
- emp084@madtvk.com / emp084
- emp085@madtvk.com / emp085
- emp086@madtvk.com / emp086
- emp087@madtvk.com / emp087
- emp088@madtvk.com / emp088
- emp089@madtvk.com / emp089
- emp090@madtvk.com / emp090

### emp091 - emp100
- emp091@madtvk.com / emp091
- emp092@madtvk.com / emp092
- emp093@madtvk.com / emp093
- emp094@madtvk.com / emp094
- emp095@madtvk.com / emp095
- emp096@madtvk.com / emp096
- emp097@madtvk.com / emp097
- emp098@madtvk.com / emp098
- emp099@madtvk.com / emp099
- emp100@madtvk.com / emp100

---

## 🚀 How to Login:

### For Employees:
1. Go to: `employee-login.html`
2. Enter your email: `emp001@madtvk.com`
3. Enter your password: `emp001`
4. Click "உள்நுழைக (Login)"
5. You'll be redirected to the employee dashboard

### Example for Employee 25:
- **Website**: [Your Domain]/employee-login.html
- **Email**: emp025@madtvk.com
- **Password**: emp025

---

## 🔧 Setup Instructions:

### Step 1: Run SQL Script
1. Open Supabase SQL Editor
2. Run the complete `setup-employees.sql` file
3. This will create all 100 employee records

### Step 2: Verify Setup
Run this query in Supabase:
```sql
SELECT employee_id, email, password, full_name, status 
FROM employees 
ORDER BY employee_id 
LIMIT 10;
```

You should see:
- emp_1 | emp001@madtvk.com | emp001 | active
- emp_2 | emp002@madtvk.com | emp002 | active
- ... etc

### Step 3: Test Login
1. Open employee-login.html
2. Try: emp001@madtvk.com / emp001
3. Should redirect to employee dashboard
4. Should be able to register members

---

## 🔒 Security Notes:

### Current Setup:
- ✅ Passwords stored in plain text in database
- ✅ Simple email/password matching
- ✅ No Supabase Auth required
- ✅ Easy to manage and change passwords

### Important:
- Passwords are visible in the database
- Anyone with database access can see passwords
- Suitable for internal systems with trusted employees
- NOT recommended for public-facing applications

### To Change a Password:
Run this SQL command:
```sql
UPDATE employees 
SET password = 'newpassword123' 
WHERE employee_id = 'EMP001';
```

Or use the Admin Employee Management interface.

---

## 📱 Employee Workflow:

### 1. Login
- Use assigned email and password
- System checks database for matching credentials
- Only active employees can login

### 2. Register Members
- Navigate to "Office Activities"
- Fill BLA registration form
- System automatically tracks employee ID

### 3. Track Performance
- Admin can view which employee registered which members
- Admin sees statistics via Employee Performance Report

---

## 🎯 Password Pattern:

### Format: `empXXX`
- **XXX** = 3-digit number with leading zeros
- **Examples**:
  - Employee 1 → emp001
  - Employee 10 → emp010
  - Employee 99 → emp099
  - Employee 100 → emp100

### Easy to Remember:
- Email: emp**001**@madtvk.com
- Password: emp**001**
- Just remember the number!

---

## 📊 Quick Reference Card:

Print this for employees:

```
┌─────────────────────────────────────┐
│   TVK EMPLOYEE LOGIN CREDENTIALS    │
├─────────────────────────────────────┤
│                                     │
│  Email: emp___@madtvk.com          │
│         (fill your 3-digit number)  │
│                                     │
│  Password: emp___                   │
│           (same 3-digit number)     │
│                                     │
│  Examples:                          │
│  • emp001@madtvk.com / emp001      │
│  • emp025@madtvk.com / emp025      │
│  • emp100@madtvk.com / emp100      │
│                                     │
│  Login at: employee-login.html      │
└─────────────────────────────────────┘
```

---

## ✅ Testing Checklist:

- [ ] SQL script ran successfully
- [ ] All 100 employees created in database
- [ ] Test login with emp001@madtvk.com / emp001
- [ ] Employee dashboard loads after login
- [ ] Can access Office Activities
- [ ] Can register a test member
- [ ] Admin can see employee in performance report
- [ ] Member tracking works (registered_by_employee_id populated)

---

## 🆘 Troubleshooting:

### "Invalid email or password"
- Check email format: must be exactly `empXXX@madtvk.com`
- Check password format: must be exactly `empXXX`
- Verify employee status is 'active' in database
- Ensure SQL script ran successfully

### "Login error occurred"
- Check Supabase connection
- Verify `employees` table exists
- Check browser console for errors
- Verify `supabase-config.js` is loaded

### Employee can't register members
- Verify session is stored correctly
- Check `registered_by_employee_id` in member record
- Ensure employee ID matches database

---

## 🎉 Summary:

- **100 employees ready to use**
- **Simple login: email + password**
- **No Supabase Auth needed**
- **Easy password management**
- **Ready for production!**

Just run the SQL script and start using! 🚀

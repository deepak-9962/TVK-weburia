# 🚀 TVK Admin System - Quick Setup Guide

## 📦 What You Got

✅ **admin-login.html** - Secure login page  
✅ **admin-dashboard.html** - Admin control panel  
✅ **admin-password-generator.html** - Password hash generator tool  
✅ **create-admin-user.sql** - Database setup script  
✅ **ADMIN_SETUP_GUIDE.md** - Full documentation  
✅ **Updated database-schema.sql** - With `is_admin` column  
✅ **Updated index.html** - Navigation points to admin login  

---

## ⚡ 3-Minute Setup

### Step 1: Update Database (1 min)
Go to **Supabase Dashboard** → **SQL Editor** → Paste & Run:

```sql
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
```

### Step 2: Create Admin User (1 min)

**Option A - Use Password Generator (Recommended)**
1. Open `admin-password-generator.html` in browser
2. Enter username, full name, and password
3. Click "Generate Hash & SQL"
4. Copy the SQL query
5. Paste and run in Supabase SQL Editor

**Option B - Use Default Admin**
Run in Supabase SQL Editor:
```sql
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES (
    'admin',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'System Administrator',
    true,
    true
);
```

### Step 3: Test Login (1 min)
1. Open `index.html` in browser
2. Click "பூத் முகவர்கள் BLA" → "நிர்வாகம் (Admin)"
3. Login:
   - Username: `admin`
   - Password: `admin123`
4. You're in! 🎉

---

## 🔒 Security Flow

```
Main Page → BLA Dropdown → Admin Link
    ↓
Admin Login (admin-login.html)
    ↓
Check: username + password + is_admin = true?
    ↓ YES
Admin Dashboard (admin-dashboard.html)
    ↓
Access All Features:
- Member Registration
- Photo Gallery  
- Reports
- Statistics
```

---

## 🛠️ Quick Commands

### View All Admins
```sql
SELECT username, full_name, is_admin, is_active 
FROM public.employees 
WHERE is_admin = true;
```

### Make User Admin
```sql
UPDATE public.employees 
SET is_admin = true 
WHERE username = 'username_here';
```

### Remove Admin Rights
```sql
UPDATE public.employees 
SET is_admin = false 
WHERE username = 'username_here';
```

### Change Password
1. Use `admin-password-generator.html` to generate new hash
2. Run:
```sql
UPDATE public.employees 
SET password_hash = 'new_hash_here' 
WHERE username = 'admin';
```

---

## 📁 File Map

| File | Purpose | When to Use |
|------|---------|-------------|
| `admin-login.html` | Login page | Users go here first |
| `admin-dashboard.html` | Control panel | After successful login |
| `admin-password-generator.html` | Hash generator | Creating new admin users |
| `create-admin-user.sql` | SQL script | Initial database setup |
| `database-schema.sql` | Full schema | Database creation |
| `ADMIN_SETUP_GUIDE.md` | Full docs | Detailed reference |

---

## 🎯 Default Credentials

⚠️ **CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

| Username | Password | Hash |
|----------|----------|------|
| `admin` | `admin123` | `240be518...` |
| `tvkadmin` | `admin` | `8c6976e5...` |

---

## 🐛 Troubleshooting

**Can't login?**
```sql
-- Check if user exists and is admin
SELECT * FROM employees WHERE username = 'admin';
-- Should show is_admin = true
```

**Forgot password?**
1. Open `admin-password-generator.html`
2. Generate new hash
3. Update in database

**Not redirecting to dashboard?**
- Clear browser cache
- Check browser console (F12)
- Verify SessionStorage is enabled

---

## ✨ Features

### Admin Login Page
- 🔐 Secure authentication
- 🌐 Tamil/English bilingual
- 👁️ Password visibility toggle
- ✅ Auto-redirect if logged in
- 🎨 Beautiful TVK design

### Admin Dashboard
- 📊 Live statistics
- 👥 Member management
- 📸 Photo gallery access
- 📋 Quick action cards
- 🔄 Auto-refresh data
- 🚪 Logout functionality

---

## 📞 Need Help?

1. Check `ADMIN_SETUP_GUIDE.md` for detailed instructions
2. Open browser console (F12) to see errors
3. Verify database connection in Supabase
4. Ensure all files are in the correct location

---

## ✅ Setup Checklist

- [ ] Database schema updated with `is_admin` column
- [ ] Admin user created in database
- [ ] Tested login with admin credentials
- [ ] Dashboard loads with statistics
- [ ] Default password changed
- [ ] Non-admin users cannot access (test this!)
- [ ] Logout works correctly
- [ ] Navigation link points to admin login

---

## 🎉 You're Ready!

Your admin system is fully functional. Happy managing! 🚀

**Last Updated**: October 3, 2025

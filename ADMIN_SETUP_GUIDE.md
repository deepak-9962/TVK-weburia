# TVK BLA நிர்வாக அமைப்பு வழிகாட்டி
# TVK BLA Admin System Guide

## 📋 Overview / மேலோட்டம்

இந்த அமைப்பு BLA (பூத் முகவர்கள்) அலுவலக செயல்பாடுகளை நிர்வாகிகள் மட்டுமே அணுக முடியும் வகையில் பாதுகாக்கிறது.

This system secures BLA (Booth Level Agents) office activities so only administrators can access them.

## 🔐 Security Flow / பாதுகாப்பு ஓட்டம்

1. **பொது பயனர்** → முகப்பு பக்கம் → "பூத் முகவர்கள் BLA" → "நிர்வாகம் (Admin)"
2. **உள்நுழைவு பக்கம்** → நிர்வாகி விவரங்களை உள்ளிடவும்
3. **அங்கீகரிப்பு சரிபார்ப்பு** → பயனர் பெயர், கடவுச்சொல், is_admin = true
4. **நிர்வாக டாஷ்போர்டு** → அனைத்து BLA அம்சங்களுக்கும் அணுகல்

## 📁 Files Created / உருவாக்கப்பட்ட கோப்புகள்

### 1. `admin-login.html`
- **Purpose**: Secure login page for administrators only
- **Features**:
  - Tamil/English bilingual interface
  - Password visibility toggle
  - Session-based authentication
  - Auto-redirect if already logged in
  - Beautiful responsive design with TVK branding

### 2. `admin-dashboard.html`
- **Purpose**: Central admin control panel
- **Features**:
  - Real-time statistics (members, activities, complaints, pending tasks)
  - Quick access cards to all BLA features
  - User info display with logout
  - Links to member registration, photo gallery, reports
  - Protected route - redirects to login if not admin

### 3. `create-admin-user.sql`
- **Purpose**: SQL script to create admin users
- **Features**:
  - Sample admin users with hashed passwords
  - Instructions for creating custom admin accounts
  - RLS policies for security
  - Promotion/demotion scripts

## 🗄️ Database Changes / தரவுத்தள மாற்றங்கள்

### Updated `employees` table schema:

```sql
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(200),
    is_admin BOOLEAN DEFAULT false,  -- NEW FIELD
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Setup Instructions / அமைப்பு வழிமுறைகள்

### Step 1: Update Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Run the updated schema from `database-schema.sql`
3. This adds the `is_admin` column to employees table

### Step 2: Create Admin User
1. Open `create-admin-user.sql` in Supabase SQL Editor
2. Run the script to create default admin accounts:
   - **Username**: `admin` | **Password**: `admin123`
   - **Username**: `tvkadmin` | **Password**: `admin`
3. **IMPORTANT**: Change these passwords immediately!

### Step 3: Test Admin Login
1. Open your website: `index.html`
2. Click "பூத் முகவர்கள் BLA" in navigation
3. Click "நிர்வாகம் (Admin)" from dropdown
4. Login with:
   - Username: `admin`
   - Password: `admin123`
5. You should see the admin dashboard!

### Step 4: Create Custom Admin User (Recommended)
1. Generate SHA-256 hash of your password:
   ```javascript
   // In browser console:
   const encoder = new TextEncoder();
   const data = encoder.encode('your_secure_password');
   crypto.subtle.digest('SHA-256', data).then(hash => {
       const hashArray = Array.from(new Uint8Array(hash));
       console.log(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
   });
   ```

2. Run in Supabase SQL Editor:
   ```sql
   INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
   VALUES (
       'your_username',
       'your_generated_hash',
       'Your Full Name',
       true,
       true
   );
   ```

## 🔒 Security Features / பாதுகாப்பு அம்சங்கள்

### Authentication Checks
- ✅ Username and password validation
- ✅ `is_admin` flag verification
- ✅ `is_active` status check
- ✅ Session storage for persistent login
- ✅ Auto-redirect on unauthorized access

### Password Security
- ✅ SHA-256 hashing (client-side)
- ✅ Password visibility toggle
- ✅ No plain text storage
- ⚠️ **Note**: For production, upgrade to bcrypt server-side hashing

### Session Management
- ✅ SessionStorage for login state
- ✅ Automatic session validation on dashboard
- ✅ Logout functionality
- ✅ Session timeout on browser close

## 📊 Admin Dashboard Features / நிர்வாக டாஷ்போர்டு அம்சங்கள்

### Statistics Cards
1. **Total Members** - Live count from `bla_members` table
2. **Activities** - Count from `activities` table
3. **Complaints** - Count from `complaints` table
4. **Pending Tasks** - Count from `office_tasks` where status='pending'

### Action Cards
1. **Member Registration** → `bla-office-entry.html`
2. **Member Photos** → `member-photos.html`
3. **Member List** → Coming soon
4. **Reports** → Coming soon

### Quick Links
- Home page
- Public registration form
- Settings (coming soon)
- User management (coming soon)

## 🎯 User Flow / பயனர் ஓட்டம்

### For Admin Users:
```
Main Page → BLA Dropdown → நிர்வாகம் (Admin) 
    ↓
Admin Login Page (admin-login.html)
    ↓
Enter credentials (username + password)
    ↓
Verify: is_admin = true?
    ↓
Admin Dashboard (admin-dashboard.html)
    ↓
Access all BLA features:
- Member Registration
- Photo Gallery
- Member List
- Reports
```

### For Non-Admin Users:
```
Admin Login Page → Enter credentials
    ↓
Verify: is_admin = false?
    ↓
❌ Error: "You are not an admin"
    ↓
Access Denied
```

## 🔧 Customization / தனிப்பயனாக்கம்

### Change Login Page Branding
Edit `admin-login.html`:
```html
<img src="images/tvk-logo.svg" alt="TVK Logo" class="logo-img">
<h1 class="login-title">நிர்வாக பேனல்</h1>
```

### Add More Statistics
Edit `admin-dashboard.html` → `loadStatistics()` function:
```javascript
const { count: newStatCount } = await supabase
    .from('your_table')
    .select('*', { count: 'exact', head: true });
```

### Add New Action Cards
Edit `admin-dashboard.html`:
```html
<div class="action-card" onclick="window.location.href='your-page.html'">
    <div class="action-header primary">
        <div class="action-icon"><i class="fas fa-icon"></i></div>
        <div class="action-title">Your Title</div>
    </div>
    <div class="action-body">
        <p class="action-description">Description</p>
        <button class="action-btn">Button Text</button>
    </div>
</div>
```

## 🛡️ Best Practices / சிறந்த நடைமுறைகள்

### Security
1. ✅ Change default passwords immediately
2. ✅ Use strong, unique passwords
3. ✅ Enable RLS on employees table
4. ✅ Regularly audit admin access
5. ✅ Implement password expiry (future enhancement)

### Database
1. ✅ Backup employees table regularly
2. ✅ Monitor admin login attempts
3. ✅ Keep audit logs of admin actions
4. ✅ Use indexes for performance

### User Management
1. ✅ Create separate admin accounts (don't share)
2. ✅ Revoke admin access when employee leaves
3. ✅ Regular access reviews
4. ✅ Document all admin users

## 📝 Common Tasks / பொதுவான பணிகள்

### Create New Admin
```sql
INSERT INTO public.employees (username, password_hash, full_name, is_admin, is_active)
VALUES ('newadmin', 'hash_here', 'Full Name', true, true);
```

### Promote Existing Employee to Admin
```sql
UPDATE public.employees 
SET is_admin = true 
WHERE username = 'employee_username';
```

### Revoke Admin Access
```sql
UPDATE public.employees 
SET is_admin = false 
WHERE username = 'admin_username';
```

### List All Admins
```sql
SELECT username, full_name, created_at 
FROM public.employees 
WHERE is_admin = true AND is_active = true;
```

### Deactivate Admin User
```sql
UPDATE public.employees 
SET is_active = false 
WHERE username = 'admin_username';
```

## 🐛 Troubleshooting / சிக்கல் தீர்வு

### Issue: Can't Login
- ✅ Check username spelling (case-sensitive)
- ✅ Verify password hash is correct
- ✅ Ensure `is_admin = true` in database
- ✅ Check `is_active = true`
- ✅ Open browser console for errors

### Issue: Redirected to Login After Login
- ✅ Check browser console for session errors
- ✅ Ensure SessionStorage is enabled
- ✅ Clear browser cache and try again
- ✅ Verify admin user exists in database

### Issue: Statistics Not Loading
- ✅ Check Supabase connection
- ✅ Verify tables exist (bla_members, activities, etc.)
- ✅ Check RLS policies allow reading
- ✅ Open browser console for errors

### Issue: "Access Denied" Error
- ✅ Verify `is_admin = true` in database
- ✅ Check if user account is active
- ✅ Ensure correct credentials
- ✅ Try logging out and back in

## 🚀 Future Enhancements / எதிர்கால மேம்பாடுகள்

- [ ] Bcrypt password hashing
- [ ] Two-factor authentication (2FA)
- [ ] Password reset functionality
- [ ] Session timeout settings
- [ ] Login attempt limiting
- [ ] Admin activity logs
- [ ] Email notifications
- [ ] Role-based permissions (super admin, admin, moderator)
- [ ] Member list export
- [ ] Advanced reporting
- [ ] User management interface

## 📞 Support / ஆதரவு

If you need help:
1. Check this guide first
2. Review browser console errors
3. Check Supabase logs
4. Verify database schema
5. Contact system administrator

## ✅ Testing Checklist / சோதனை பட்டியல்

Before deployment:
- [ ] Database schema updated with `is_admin` column
- [ ] Admin user created in database
- [ ] Login page accessible from navigation
- [ ] Can login with admin credentials
- [ ] Non-admin users cannot access dashboard
- [ ] Statistics loading correctly
- [ ] All action cards clickable
- [ ] Logout functionality works
- [ ] Default passwords changed
- [ ] RLS policies enabled

---

**Last Updated**: October 3, 2025  
**Version**: 1.0  
**Author**: TVK Development Team

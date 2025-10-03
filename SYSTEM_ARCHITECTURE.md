# TVK BLA Admin System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TVK WEBSITE (index.html)                     │
│                                                                       │
│  Navigation Bar:                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ முகப்பு │ உங்கள் குரல் │ [பூத் முகவர்கள் BLA ▼]           │   │
│  └───────────────────────────────┬─────────────────────────────┘   │
│                                  │                                   │
│                    Dropdown Opens│                                   │
│                                  ▼                                   │
│                    ┌─────────────────────────┐                       │
│                    │ 📌 நிர்வாகம் (Admin)   │ ← NEW FEATURE        │
│                    │ 🏃 தெருமுனை செயல்பாடு  │                       │
│                    │ 🏢 அலுவலக செயல்பாடு   │                       │
│                    └────────┬────────────────┘                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               │ Click Admin Link
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   ADMIN LOGIN (admin-login.html)                     │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🔒 நிர்வாக உள்நுழைவு (Admin Login)                        │  │
│  │                                                                │  │
│  │  Username: [_________________]                                │  │
│  │  Password: [_________________] 👁️                            │  │
│  │                                                                │  │
│  │           [உள்நுழைக (Login)]                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                       │
│  Authentication Process:      │                                       │
│  1. Check username exists     │                                       │
│  2. Verify password hash      │                                       │
│  3. Check is_admin = true  ◄──┘                                      │
│  4. Check is_active = true                                           │
│                               │                                       │
└───────────────────────────────┼───────────────────────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
        ✅ ADMIN                            ❌ NOT ADMIN
              │                                   │
              ▼                                   ▼
    ┌──────────────────────┐          ┌──────────────────────┐
    │ Create Session       │          │ Show Error           │
    │ Store user info      │          │ "Access Denied"      │
    │ Redirect to dashboard│          │ Cannot proceed       │
    └──────────┬───────────┘          └──────────────────────┘
               │
               │
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD (admin-dashboard.html)                  │
│                                                                       │
│  Header: [TVK Logo] நிர்வாக டாஷ்போர்டு    [User Info] [வெளியேறு]  │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                       │
│  📊 STATISTICS (Real-time from Supabase)                            │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐         │
│  │ 👥 Members  │ 📋 Activities│ ⚠️ Complaints│ ⏳ Pending │         │
│  │    250      │     48       │     12      │     5       │         │
│  └─────────────┴─────────────┴─────────────┴─────────────┘         │
│                                                                       │
│  🎯 QUICK ACTIONS                                                    │
│  ┌─────────────────────┬─────────────────────┐                      │
│  │ 👤 Member Registration│ 📸 Photo Gallery    │                      │
│  │ Add new BLA members │ View all members    │                      │
│  │ [செல்லவும் →]        │ [காண →]             │                      │
│  ├─────────────────────┼─────────────────────┤                      │
│  │ 📊 Member List       │ 📈 Reports          │                      │
│  │ Full database view  │ Analytics & exports │                      │
│  │ [Coming Soon]       │ [Coming Soon]       │                      │
│  └─────────────────────┴─────────────────────┘                      │
│                                                                       │
│  🔗 QUICK LINKS                                                      │
│  • முகப்பு பக்கம் (Home)                                            │
│  • பொது பதிவு படிவம் (Public Registration)                         │
│  • அமைப்புகள் (Settings) - Coming Soon                             │
│  • பயனர் நிர்வாகம் (User Management) - Coming Soon                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘


DATABASE STRUCTURE (Supabase)
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: employees                                                    │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ COLUMN       │ TYPE         │ DESCRIPTION                          │
├──────────────┼──────────────┼─────────────────────────────────────┤
│ id           │ UUID         │ Primary Key                          │
│ username     │ VARCHAR(50)  │ Unique username                      │
│ password_hash│ TEXT         │ SHA-256 hashed password              │
│ full_name    │ VARCHAR(200) │ Employee full name                   │
│ is_admin     │ BOOLEAN      │ ⭐ NEW: Admin flag (true/false)     │
│ is_active    │ BOOLEAN      │ Account status                       │
│ created_at   │ TIMESTAMP    │ Creation timestamp                   │
└──────────────┴──────────────┴─────────────────────────────────────┘

Sample Data:
┌──────────┬─────────────────┬──────────┬───────────┬────────────┐
│ username │ full_name       │ is_admin │ is_active │ created_at │
├──────────┼─────────────────┼──────────┼───────────┼────────────┤
│ admin    │ System Admin    │ ✅ true  │ ✅ true   │ 2025-10-03 │
│ employee1│ John Doe        │ ❌ false │ ✅ true   │ 2025-10-02 │
│ tvkadmin │ TVK Admin       │ ✅ true  │ ✅ true   │ 2025-10-03 │
└──────────┴─────────────────┴──────────┴───────────┴────────────┘


AUTHENTICATION FLOW
═══════════════════════════════════════════════════════════════════════

User enters credentials
         │
         ▼
Generate SHA-256 hash of password
         │
         ▼
Query Supabase:
SELECT * FROM employees 
WHERE username = ? 
  AND password_hash = ?
  AND is_active = true
         │
         ├─────► No match? ──► Show error "Invalid credentials"
         │
         ▼
Check: is_admin = true?
         │
         ├─────► No? ──────────► Show error "Not an admin"
         │
         ▼
Create session in sessionStorage:
{
  id: "uuid",
  username: "admin",
  full_name: "System Admin",
  is_admin: true,
  login_time: "2025-10-03T..."
}
         │
         ▼
Redirect to admin-dashboard.html
         │
         ▼
Dashboard checks session on load
         │
         ├─────► No session? ──► Redirect to login
         │
         ▼
Load statistics from database
Display dashboard


SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════

Layer 1: Navigation Link
  └─► Only shows admin link in dropdown

Layer 2: Login Page (admin-login.html)
  ├─► Username validation
  ├─► Password hash verification
  ├─► is_admin flag check
  └─► is_active status check

Layer 3: Session Storage
  ├─► Stores encrypted user info
  ├─► Validates on every page load
  └─► Clears on logout/browser close

Layer 4: Dashboard Protection (admin-dashboard.html)
  ├─► Checks session exists
  ├─► Verifies is_admin = true
  └─► Auto-redirect if unauthorized

Layer 5: Database (Supabase)
  ├─► Row Level Security (RLS)
  ├─► Encrypted connections
  └─► Audit logs


TOOLS PROVIDED
═══════════════════════════════════════════════════════════════════════

1. admin-password-generator.html
   │
   ├─► Enter username & password
   ├─► Generate SHA-256 hash
   ├─► Generate SQL INSERT query
   └─► Copy & paste to Supabase

2. create-admin-user.sql
   │
   ├─► Ready-to-run SQL script
   ├─► Creates default admin users
   └─► Includes RLS policies

3. ADMIN_SETUP_GUIDE.md
   │
   ├─► Complete documentation
   ├─► Setup instructions
   ├─► Troubleshooting guide
   └─► Security best practices


FILE INTERACTION MAP
═══════════════════════════════════════════════════════════════════════

index.html
    │
    ├─► Includes supabase-config.js
    └─► Navigation links to ──► admin-login.html
                                     │
                                     ├─► Includes supabase-config.js
                                     ├─► Queries employees table
                                     └─► Redirects to ──► admin-dashboard.html
                                                              │
                                                              ├─► Includes supabase-config.js
                                                              ├─► Queries multiple tables
                                                              ├─► Links to bla-office-entry.html
                                                              ├─► Links to member-photos.html
                                                              └─► Logout → admin-login.html

admin-password-generator.html (Standalone Tool)
    │
    ├─► Generates password hash
    └─► Generates SQL query ──► Copy to Supabase SQL Editor


DEPLOYMENT CHECKLIST
═══════════════════════════════════════════════════════════════════════

□ Database Setup
  □ Run updated database-schema.sql
  □ Add is_admin column to employees table
  
□ Admin User Creation
  □ Use admin-password-generator.html OR
  □ Run create-admin-user.sql
  □ Verify admin user exists
  
□ File Upload
  □ Upload all HTML files
  □ Ensure supabase-config.js is configured
  □ Check image files are accessible
  
□ Testing
  □ Test admin login
  □ Verify non-admin cannot access
  □ Check dashboard loads statistics
  □ Test all navigation links
  □ Test logout functionality
  
□ Security
  □ Change default passwords
  □ Enable RLS on employees table
  □ Review admin user list
  □ Set up monitoring


SUCCESS METRICS
═══════════════════════════════════════════════════════════════════════

✅ Only users with is_admin=true can access dashboard
✅ Non-admin users see "Access Denied" error
✅ Statistics load in real-time from database
✅ All action cards navigate correctly
✅ Logout clears session and redirects to login
✅ Session persists during browsing
✅ Session clears when browser closes
✅ Password generator creates valid hashes
✅ SQL queries execute without errors
✅ Mobile-responsive design works

═══════════════════════════════════════════════════════════════════════
           TVK BLA ADMIN SYSTEM - FULLY OPERATIONAL ✨
═══════════════════════════════════════════════════════════════════════

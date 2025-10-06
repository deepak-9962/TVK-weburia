## TVK Employee Data Entry Workflow - Complete Implementation Guide

### Overview
This document describes the complete employee workflow implementation for the TVK-weburia project. This workflow allows authenticated employee users to select specific Areas and Part Numbers before filling out the BLA member registration form.

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [File Structure](#file-structure)
3. [Setup Instructions](#setup-instructions)
4. [User Flow](#user-flow)
5. [Technical Implementation](#technical-implementation)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)

---

## 🗄️ Database Schema

### Tables Created

#### 1. `areas` Table
Stores unique Area/Union/Town names from Madhavaram constituency.

```sql
CREATE TABLE public.areas (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Total Areas:** 42 areas covering:
- 6 Madhavaram Area Parts
- 7 Puzhal Union Panchayats
- 13 Villivakkam Union Panchayats
- 15 Sholavaram Union Panchayats
- 1 Sengundram Town

#### 2. `parts` Table
Stores Part Numbers linked to specific Areas.

```sql
CREATE TABLE public.parts (
    id SERIAL PRIMARY KEY,
    part_number INTEGER NOT NULL,
    area_id INTEGER NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(part_number, area_id)
);
```

**Total Parts:** 475 part numbers distributed across all areas.

### Data Distribution Examples

| Area Name | Part Numbers | Count |
|-----------|--------------|-------|
| Madhavaram North Part | 1-12, 145-147, 164-193, 233-242 | 52 |
| Madhavaram Central Part | 243-267 | 25 |
| Madhavaram East Part | 27, 29-59 | 32 |
| Sholavaram Union - Padianallur Panchayat | 446-475 | 30 |
| Sengundram Town - Naravarikuppam | 268-295 | 28 |

---

## 📁 File Structure

### New Files Created

```
tvk/
├── employee-workflow-schema.sql   # Complete database schema and data
├── employee-login.html            # Employee login page
├── employee-dashboard.html        # Area/Part selection dashboard
├── employee-auth.js              # Authentication and dashboard logic
└── EMPLOYEE-WORKFLOW-README.md   # This documentation file
```

### Modified Files

```
tvk/
└── bla-office-entry.js           # Updated to handle URL parameters
```

---

## 🚀 Setup Instructions

### Step 1: Create Database Tables and Insert Data

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Navigate to your TVK project
   - Click on "SQL Editor"

2. **Execute Schema File**
   - Copy the entire content of `employee-workflow-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter
   - Wait for confirmation (should create 42 areas and 475 parts)

3. **Verify Installation**
   ```sql
   -- Count total areas (should return 42)
   SELECT COUNT(*) as total_areas FROM public.areas;
   
   -- Count total parts (should return 475)
   SELECT COUNT(*) as total_parts FROM public.parts;
   
   -- View sample area with parts
   SELECT a.name, COUNT(p.id) as part_count
   FROM public.areas a
   LEFT JOIN public.parts p ON a.id = p.area_id
   GROUP BY a.name
   ORDER BY a.name
   LIMIT 10;
   ```

### Step 2: Create Employee User Accounts

Employees must have Supabase Auth accounts to log in.

**Option A: Using Supabase Dashboard**
1. Go to "Authentication" > "Users"
2. Click "Add User"
3. Enter email and password
4. Click "Create User"

**Option B: Using SQL (if you have access)**
```sql
-- Note: This requires proper authentication setup
-- Contact your Supabase admin for user creation
```

**Test Accounts (for development):**
- Email: `employee1@tvk.com` / Password: `Test@123`
- Email: `employee2@tvk.com` / Password: `Test@123`

### Step 3: Deploy Files

1. Upload all new files to your web server:
   - `employee-login.html`
   - `employee-dashboard.html`
   - `employee-auth.js`

2. Ensure the files are in the same directory as:
   - `bla-office-entry.html`
   - `bla-office-entry.js`
   - `images/tvk-logo.svg`

### Step 4: Configure Navigation

Add employee login link to your main navigation (in `index.html`):

```html
<li><a href="employee-login.html">
    <i class="fas fa-user-tie"></i> ஊழியர் நுழைவு
</a></li>
```

---

## 👤 User Flow

### Complete Workflow Diagram

```
┌─────────────────────┐
│  Employee Login     │
│  (email/password)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Authentication     │
│  via Supabase Auth  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Employee Dashboard  │
│ - Enter Voter ID    │
│ - Select Area       │
│ - Select Part No.   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ BLA Registration    │
│ (pre-filled fields) │
│ - Voter ID (locked) │
│ - Part No. (locked) │
└─────────────────────┘
```

### Detailed Step-by-Step Flow

#### Step 1: Employee Login
- Navigate to `employee-login.html`
- Enter registered email and password
- Click "உள்நுழைக (Login)"
- On success: Redirect to `employee-dashboard.html`
- On failure: Show error message

#### Step 2: Area and Part Selection
1. **Enter Voter ID**
   - Format: ABC1234567 (3 letters + 7 numbers)
   - Example: ABC1234567
   - Required field

2. **Select Area**
   - Dropdown populated from `areas` table
   - 42 areas available
   - Auto-sorted alphabetically
   - When selected: Enables Part Number dropdown

3. **Select Part Number**
   - Dropdown shows only parts for selected area
   - Disabled until area is selected
   - Shows "பாகம் X (Part X)" format
   - Auto-sorted numerically

4. **Continue**
   - Button enabled only when all fields filled
   - Redirects to BLA form with URL parameters
   - Example: `bla-office-entry.html?voterId=ABC1234567&partNumber=145`

#### Step 3: BLA Registration Form
- Form opens with pre-filled fields
- Voter ID field: Read-only, styled with blue background
- Part Number field: Read-only, styled with blue background
- Info banner shows: "ஊழியர் தரவு நுழைவு" (Employee Data Entry)
- Employee completes remaining form fields
- Submits to database

---

## 🔧 Technical Implementation

### Authentication System

**Technology:** Supabase Authentication
**Method:** Email/Password Sign-in

```javascript
// Login implementation
const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
});
```

**Session Storage:**
```javascript
sessionStorage.setItem('tvk_employee_session', JSON.stringify({
    user_id: data.user.id,
    email: data.user.email,
    login_time: new Date().toISOString()
}));
```

### Dynamic Dropdown Population

**Areas Dropdown:**
```javascript
const { data: areas, error } = await supabase
    .from('areas')
    .select('id, name')
    .order('name', { ascending: true });
```

**Parts Dropdown (filtered by area):**
```javascript
const { data: parts, error } = await supabase
    .from('parts')
    .select('id, part_number')
    .eq('area_id', areaId)
    .order('part_number', { ascending: true });
```

### URL Parameter Passing

**Redirect with parameters:**
```javascript
window.location.href = `bla-office-entry.html?voterId=${voterId}&partNumber=${partNumber}`;
```

**Parse and pre-fill:**
```javascript
const urlParams = new URLSearchParams(window.location.search);
const voterId = urlParams.get('voterId');
const partNumber = urlParams.get('partNumber');

voterNumberInput.value = voterId;
voterNumberInput.setAttribute('readonly', 'readonly');
```

### Security Features

1. **Authentication Check**
   - Every page checks for valid session
   - Redirects to login if unauthorized
   - Auto-logout on session expiry

2. **Read-Only Fields**
   - Pre-filled fields cannot be modified
   - Visual indication (blue background)
   - Cursor change to "not-allowed"

3. **Data Validation**
   - Voter ID pattern validation
   - Required field checks
   - Form submit disabled until valid

---

## 🧪 Testing Guide

### Test Case 1: Employee Login

**Steps:**
1. Navigate to `employee-login.html`
2. Enter valid credentials
3. Click Login

**Expected Result:**
- ✅ Loading spinner shows
- ✅ Redirect to `employee-dashboard.html`
- ✅ Session stored in sessionStorage
- ✅ Logout button visible

**Test with Invalid Credentials:**
- ❌ Error message shows in Tamil/English
- ❌ No redirect
- ❌ Form remains active

### Test Case 2: Area Selection

**Steps:**
1. Login as employee
2. Enter Voter ID: ABC1234567
3. Select "Madhavaram North Part" from dropdown

**Expected Result:**
- ✅ Part Number dropdown enables
- ✅ Shows parts: 1-12, 145-147, 164-193, 233-242
- ✅ Parts sorted numerically
- ✅ Continue button still disabled

### Test Case 3: Part Number Selection

**Steps:**
1. Complete Area selection
2. Select Part Number from dropdown
3. Click Continue

**Expected Result:**
- ✅ Redirect to `bla-office-entry.html?voterId=ABC1234567&partNumber=145`
- ✅ Form opens with pre-filled fields
- ✅ Info banner visible
- ✅ Fields are read-only

### Test Case 4: Form Validation

**Test Invalid Voter ID:**
- Enter: 123 (invalid format)
- Expected: HTML5 validation error

**Test Empty Fields:**
- Leave Voter ID empty
- Expected: Continue button disabled

**Test Part Select Before Area:**
- Try to click Part dropdown without selecting area
- Expected: Dropdown remains disabled

### Test Case 5: Database Verification

**Query 1: Check specific area's parts**
```sql
SELECT p.part_number, a.name as area_name
FROM public.parts p
JOIN public.areas a ON p.area_id = a.id
WHERE a.name = 'Madhavaram North Part'
ORDER BY p.part_number;
```

**Expected:** Should return 52 parts

**Query 2: Verify no duplicate parts**
```sql
SELECT part_number, COUNT(*) as count
FROM public.parts
GROUP BY part_number
HAVING COUNT(*) > 1;
```

**Expected:** Should return 0 rows

---

## 🔍 Troubleshooting

### Issue 1: Login Not Working

**Symptoms:**
- Error message: "Invalid email or password"
- Console error about Supabase

**Solutions:**
1. Verify user exists in Supabase Auth
2. Check Supabase URL and anon key are correct
3. Ensure email is verified (if required)
4. Check browser console for detailed errors

**Debug Code:**
```javascript
// Add to employee-auth.js login function
console.log('Supabase URL:', SUPABASE_URL);
console.log('Login attempt:', email);
console.log('Auth response:', data);
```

### Issue 2: Dropdowns Not Populating

**Symptoms:**
- Area dropdown shows only "-- Select Area --"
- Part dropdown remains disabled

**Solutions:**
1. Check database connection
2. Verify tables exist and have data
3. Check Row Level Security (RLS) policies
4. Review browser console for errors

**Verification Queries:**
```sql
-- Check if areas exist
SELECT COUNT(*) FROM public.areas;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'areas';
```

**Fix RLS if needed:**
```sql
-- Enable read access for all
CREATE POLICY "Enable read access for all users" ON public.areas
    FOR SELECT USING (true);
```

### Issue 3: Pre-fill Not Working

**Symptoms:**
- BLA form opens but fields are empty
- URL has parameters but not showing in form

**Solutions:**
1. Check URL parameters format
2. Verify field IDs match: `voterNumber`, `partNumber`
3. Check console for JavaScript errors
4. Ensure `parseURLParameters()` is called

**Debug Code:**
```javascript
// Add to parseURLParameters function
console.log('URL:', window.location.href);
console.log('Params:', window.location.search);
console.log('Voter ID element:', voterNumberInput);
console.log('Part Number element:', partNumberInput);
```

### Issue 4: Session Expiry

**Symptoms:**
- User logged out unexpectedly
- Redirect to login page randomly

**Solutions:**
1. Check session storage manually:
   ```javascript
   console.log(sessionStorage.getItem('tvk_employee_session'));
   ```
2. Increase Supabase JWT expiry time (Project Settings)
3. Implement automatic token refresh

### Issue 5: Mobile Compatibility

**Symptoms:**
- Dropdowns not working on mobile
- Touch events not responsive

**Solutions:**
1. Test on actual mobile device (not just emulator)
2. Check CSS media queries
3. Verify touch event handlers
4. Add viewport meta tag if missing:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

---

## 📊 Data Statistics

### Database Metrics

| Metric | Value |
|--------|-------|
| Total Areas | 42 |
| Total Parts | 475 |
| Largest Area | Madhavaram North Part (52 parts) |
| Smallest Areas | Multiple with 1-3 parts |
| Average Parts per Area | ~11.3 |

### Area Distribution

| Union/Town | Areas | Parts Range |
|------------|-------|-------------|
| Madhavaram | 6 areas | 1-267 |
| Puzhal Union | 7 areas | 129-163 |
| Villivakkam Union | 13 areas | 296-361 |
| Sholavaram Union | 15 areas | 362-475 |
| Sengundram Town | 1 area | 268-295 |

---

## 🎯 Success Criteria

Your implementation is successful if:

- ✅ All 42 areas load in dropdown
- ✅ Part numbers filter correctly by area
- ✅ Employee login works with valid credentials
- ✅ BLA form pre-fills correctly
- ✅ Read-only fields cannot be edited
- ✅ Info banner shows on pre-filled form
- ✅ Logout functionality works
- ✅ Session persists across page refreshes
- ✅ Mobile responsive design works
- ✅ No console errors

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify database connection in Supabase dashboard
3. Review this documentation
4. Test with different browsers
5. Check Supabase logs for backend errors

---

## 🔄 Future Enhancements

Potential improvements:
1. Search/filter functionality for areas
2. Auto-complete for Voter ID
3. Voter ID verification against existing database
4. Export employee activity logs
5. Bulk data entry mode
6. Offline mode with sync
7. QR code scanner for Voter ID
8. Multi-language support
9. Advanced reporting dashboard
10. Role-based access control

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 5, 2025 | Initial implementation with complete workflow |

---

**End of Documentation**

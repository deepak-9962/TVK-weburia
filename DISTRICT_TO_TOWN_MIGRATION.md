# Database Migration: District → Town

## Summary
Changed database column name from `district` to `town` throughout the TVK application.

## Date
October 12, 2025

## Changes Made

### 1. Database Schema
**File:** `database-schema.sql`
- ✅ Changed column definition: `district VARCHAR(100)` → `town VARCHAR(100)`
- ✅ Updated sample INSERT statement

**Migration File Created:** `rename-district-to-town.sql`
- SQL command to rename the column in Supabase

### 2. Admin Dashboard
**File:** `admin-dashboard.html`
- ✅ Filter label: "மாவட்டம் (District)" → "நகரம் (Town)"
- ✅ Preview table header: "மாவட்டம் (District)" → "நகரம் (Town)"
- ✅ Action card description text updated
- ✅ All JavaScript queries updated: `.select('district')` → `.select('town')`
- ✅ All data access updated: `member.district` → `member.town`
- ✅ PDF export table header: "District" → "Town"
- ✅ Excel export column name: "District" → "Town"
- ✅ Filter comparisons: `member.district === districtFilter` → `member.town === districtFilter`

### 3. BLA Registration Form
**File:** `bla-registration.html`
- ✅ Form field label: "மாவட்டம் *" → "நகரம் *"
- ✅ Input field: `id="district"` → `id="town"`
- ✅ Input field: `name="district"` → `name="town"`

**File:** `bla-registration.js`
- ✅ Required fields array updated
- ✅ Form data mapping: `district: formData.get('district')` → `town: formData.get('town')`
- ✅ Member data object: `district: memberData.district` → `town: memberData.town`
- ✅ Test data: `district: 'சென்னை'` → `town: 'சென்னை'`

### 4. BLA Office Entry
**File:** `bla-office-entry.js`
- ✅ Form submission: `district: formData.area` → `town: formData.area`

## Migration Steps

### Step 1: Run Database Migration
Execute the SQL migration on your Supabase database:

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.bla_members 
RENAME COLUMN district TO town;
```

Or run the migration file:
```bash
psql -f rename-district-to-town.sql
```

### Step 2: Deploy Code Changes
All code files have been updated. Deploy the following files:
- ✅ admin-dashboard.html
- ✅ bla-registration.html
- ✅ bla-registration.js
- ✅ bla-office-entry.js
- ✅ database-schema.sql

### Step 3: Verify Changes
1. **Database**: Check that column is renamed
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'bla_members' 
   AND column_name = 'town';
   ```

2. **Admin Dashboard**: 
   - Open admin dashboard
   - Check filter label shows "நகரம் (Town)"
   - Check preview table header shows "நகரம் (Town)"
   - Apply town filter and verify it works
   - Export PDF and verify header shows "Town"
   - Export Excel and verify column shows "Town"

3. **BLA Registration**:
   - Open registration form
   - Check field label shows "நகரம் *"
   - Submit a test registration
   - Verify data is saved in `town` column

4. **BLA Office Entry**:
   - Open office entry form
   - Submit a test entry
   - Verify data is saved in `town` column

## Database Impact
- **Table affected**: `bla_members`
- **Column renamed**: `district` → `town`
- **Data type**: `VARCHAR(100)` (unchanged)
- **Constraints**: `NOT NULL` (unchanged)
- **Existing data**: Preserved (column rename doesn't affect data)

## Rollback Plan
If you need to rollback, run:
```sql
ALTER TABLE public.bla_members 
RENAME COLUMN town TO district;
```

Then revert the code changes.

## Files Changed Summary
```
Modified Files (6):
├─ database-schema.sql (schema definition)
├─ admin-dashboard.html (UI labels, filters, export)
├─ bla-registration.html (form field)
├─ bla-registration.js (form processing)
├─ bla-office-entry.js (form submission)
└─ rename-district-to-town.sql (migration script - NEW)

Updated References (50+):
├─ JavaScript queries: 10+ updates
├─ Data access: 20+ updates
├─ UI labels: 10+ updates
├─ Form fields: 5+ updates
└─ Export formats: 5+ updates
```

## Testing Checklist
- [ ] Database migration executed successfully
- [ ] Admin dashboard loads without errors
- [ ] Town filter dropdown populates with data
- [ ] Town filter works correctly
- [ ] Preview table shows town data
- [ ] PDF export includes town column
- [ ] Excel export includes town column
- [ ] BLA registration form shows "நகரம்" label
- [ ] BLA registration saves to town column
- [ ] BLA office entry saves to town column
- [ ] No console errors in browser
- [ ] No database query errors

## Notes
- Variable names in JavaScript code still use `district` for internal consistency
- Only user-facing labels and database column changed to `town`
- This maintains code readability while updating terminology
- All filter functionality preserved (filterDistrictId, districtFilter variables kept)

## Status
✅ **COMPLETE** - All changes implemented and ready for testing

---
**Next Steps:**
1. Run database migration on Supabase
2. Test all functionality
3. Deploy to production if tests pass

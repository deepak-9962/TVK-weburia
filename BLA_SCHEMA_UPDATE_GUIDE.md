# BLA Members Schema Update - October 2025

## Overview
This document details the database schema changes made to the `bla_members` table to align with the updated BLA office entry form.

## Changes Made

### 1. **Address Field (விலாசம்)**
- **Status**: Made NULLABLE
- **Reason**: The address field has been removed from the BLA office entry form
- **Impact**: Existing records with addresses will be preserved, new records won't require address
- **Column**: `address TEXT` (changed from `address TEXT NOT NULL`)

### 2. **Religion Field (மதம்)**
- **Status**: ENSURED EXISTS
- **Type**: `VARCHAR(100)`
- **Values**: 
  - இந்து (Hindu)
  - இஸ்லாம் (Islam)
  - கிறிஸ்தவம் (Christian)
  - பௌத்தம் (Buddhism)
  - சமணம் (Jainism)
  - சீக்கியம் (Sikhism)
  - மற்றவை (Others)
- **Purpose**: Track religious affiliation of BLA members
- **Required**: Yes (in form validation)

### 3. **Ward Circle Field (வட்டம்/ஊராட்சி/வார்டு)**
- **Status**: ENSURED EXISTS
- **Type**: `VARCHAR(200)`
- **Purpose**: Store ward/circle/uraatchi information
- **Auto-filled**: Yes (based on part number from `parts` table)

### 4. **Registered By Employee ID**
- **Status**: ENSURED EXISTS
- **Type**: `UUID`
- **Purpose**: Track which employee registered each member
- **Foreign Key**: References `employees(id)`

## Updated Table Structure

```sql
CREATE TABLE public.bla_members (
    id UUID PRIMARY KEY,
    membership_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal Information
    full_name VARCHAR(200) NOT NULL,
    father_name VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    religion VARCHAR(100),              -- NEW: Religion field
    occupation VARCHAR(100) NOT NULL,
    education VARCHAR(50),
    
    -- Contact Information
    mobile VARCHAR(15) NOT NULL,
    alt_mobile VARCHAR(15),
    email VARCHAR(255),
    address TEXT,                       -- CHANGED: Now nullable
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    
    -- Political Information
    voter_id VARCHAR(20),
    part_number VARCHAR(50),
    ward_circle VARCHAR(200),           -- NEW: Ward/Circle info
    constituency VARCHAR(100),
    member_category VARCHAR(100),
    
    -- Documents
    photo_url TEXT,
    
    -- Tracking
    registered_by_employee_id UUID,     -- NEW: Employee tracking
    
    -- Status and dates
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes Created

For optimal query performance, the following indexes have been added:

1. **idx_bla_members_religion** - Fast filtering by religion
2. **idx_bla_members_ward_circle** - Fast filtering by ward/circle
3. **idx_bla_members_voter_id** - Fast voter ID lookups
4. **idx_bla_members_part_number** - Fast filtering by part number

## Migration Steps

### Step 1: Run the Migration Script
Execute the `update-bla-members-schema.sql` file in your Supabase SQL Editor:

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy and paste the contents of update-bla-members-schema.sql
# 3. Click "Run"
```

### Step 2: Verify the Changes
The migration script will automatically verify and report:
- ✅ Address is nullable
- ✅ Religion column exists
- ✅ Ward_circle column exists
- ✅ Registered_by_employee_id exists

### Step 3: Test the Form
1. Refresh your browser (Ctrl + F5)
2. Navigate to voter-check.html
3. Login with employee credentials
4. Complete the voter check process
5. Fill out the BLA registration form
6. Verify that:
   - Address field is not present
   - Religion dropdown is visible and working
   - Ward/Circle auto-fills from part number
   - Form submits successfully

## Form Field Mapping

| Form Field | Database Column | Type | Required | Auto-fill |
|------------|----------------|------|----------|-----------|
| பெயர் | full_name | VARCHAR(200) | Yes | No |
| தந்தை/கணவர் பெயர் | father_name | VARCHAR(200) | Yes | No |
| பிறந்த தேதி | date_of_birth | DATE | Yes | No |
| பாலினம் | gender | VARCHAR(20) | Yes | No |
| மதம் | religion | VARCHAR(100) | Yes | No |
| தொலைபேசி எண் | mobile | VARCHAR(15) | Yes | No |
| வாக்காளர் எண் | voter_id | VARCHAR(20) | Yes | No |
| பாகம் எண் | part_number | VARCHAR(50) | Yes | No |
| பகுதி/ஒன்றியம்/நகரம் | district | VARCHAR(100) | Yes | Yes (from parts) |
| வட்டம்/ஊராட்சி/வார்டு | ward_circle | VARCHAR(200) | Yes | Yes (from parts) |
| உறுப்பினர் வகை | member_category | VARCHAR(100) | No | No |
| புகைப்படம் | photo_url | TEXT | No | No |

## Data Validation

### Religion Values
The form accepts these Tamil religion names:
- இந்து
- இஸ்லாம்
- கிறிஸ்தவம்
- பௌத்தம்
- சமணம்
- சீக்கியம்
- மற்றவை

### Gender Values
The form/database accepts:
- male (ஆண்)
- female (பெண்)
- other (மற்றவை)

## Backward Compatibility

### Existing Records
- Records with addresses will retain their address data
- Records without addresses will have NULL in the address field
- No data loss will occur

### Null Handling
The application should handle null values gracefully:
```javascript
// Example in JavaScript
const address = memberData.address || 'Not provided';
```

## Security Considerations

1. **Row Level Security (RLS)**: Ensure RLS policies are enabled on bla_members table
2. **Foreign Key Constraint**: The registered_by_employee_id ensures data integrity
3. **Indexes**: Improve query performance without exposing sensitive data
4. **Validation**: Client-side validation matches database constraints

## Troubleshooting

### Issue: Migration fails with "column already exists"
**Solution**: The script uses `IF NOT EXISTS` checks, so it's safe to re-run. Check the NOTICE messages in the output.

### Issue: Foreign key constraint fails
**Solution**: Ensure the `employees` table exists and has valid data before running the migration.

### Issue: Form submission fails
**Solution**: 
1. Check browser console for errors
2. Verify Supabase connection in `env.local.json`
3. Ensure all required fields are filled
4. Check that the religion field has a selected value

### Issue: Address showing in form
**Solution**: 
1. Clear browser cache (Ctrl + F5)
2. Verify you're using the updated `bla-office-entry.html` file
3. Check that no cached version is being served

## Testing Checklist

- [ ] Migration script runs without errors
- [ ] Address field is not visible in the form
- [ ] Religion dropdown appears after phone number field
- [ ] All religion options are in Tamil
- [ ] Religion field is marked as required (red asterisk)
- [ ] Form validation requires religion selection
- [ ] Form submits successfully with religion value
- [ ] Database record contains religion value
- [ ] Ward/Circle auto-fills based on part number
- [ ] Employee tracking works (registered_by_employee_id populated)
- [ ] Existing records are not affected

## Files Modified

1. **bla-office-entry.html** - Removed address field, added religion dropdown
2. **bla-office-entry.js** - Updated form validation and data collection
3. **database-schema.sql** - Updated table definition
4. **update-bla-members-schema.sql** - New migration script

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify that `env.local.json` has correct Supabase credentials
4. Ensure the migration script completed successfully
5. Test with a fresh browser session (incognito mode)

---

**Last Updated**: October 10, 2025
**Version**: 2.0
**Status**: Ready for Production

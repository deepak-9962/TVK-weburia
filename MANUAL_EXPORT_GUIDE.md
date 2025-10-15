# 📥 Manual Data Export Guide

## Problem
Your Supabase free tier is timing out on ALL queries, even simple ones. This is a known limitation of the free tier.

## Solution: Manual Export from Supabase Dashboard

### Step 1: Go to Supabase Table Editor
1. Open https://supabase.com/dashboard
2. Select project: **cbcuhojwffwppocnoxel**
3. Click **Table Editor** in left sidebar
4. Select **bla_members** table

### Step 2: Export Data
1. You should see all your member records (90 rows)
2. Look for the **three dots menu (⋮)** or **"..."** button at the top
3. Click it and select **"Export to JSON"** or **"Export as JSON"**
4. Save the file

### Step 3: Format the Exported Data
The exported file needs to be in this format:

```json
{
  "exportDate": "2025-10-14T22:40:00.000Z",
  "totalMembers": 90,
  "members": [
    {
      "id": 1,
      "full_name": "Sample Name",
      "father_name": "Father Name",
      "date_of_birth": "1990-01-01",
      "town": "Town Name",
      "mobile": "1234567890",
      "photo_url": "https://...",
      "gender": "Male",
      "member_category": "Category",
      "membership_number": "MEM001",
      "voter_id": "ABC1234567",
      "ward_circle": "Ward 1",
      "part_number": "123",
      "created_at": "2025-10-01T10:00:00.000Z"
    }
  ]
}
```

### Step 4: Save the File
1. If the exported JSON is just an array `[{...}, {...}]`, you need to wrap it:
   - Open the exported file
   - Add this at the top:
     ```json
     {
       "exportDate": "2025-10-14T22:40:00.000Z",
       "totalMembers": 90,
       "members":
     ```
   - Add `}` at the very bottom
   
2. Save the file as **`members-data.json`** in this folder: `d:\USER\tvk\`

### Step 5: Refresh the Page
1. Open http://localhost:3000/member-photos.html
2. Press **Ctrl + F5** to hard refresh
3. The page will now load instantly from the cached JSON file! ⚡

---

## Alternative: Use Supabase SQL Editor to Export

If Table Editor export doesn't work, try this SQL query:

```sql
-- Copy the result and save as JSON
SELECT json_build_object(
  'exportDate', NOW(),
  'totalMembers', COUNT(*),
  'members', json_agg(row_to_json(t))
)
FROM (
  SELECT 
    id, full_name, father_name, date_of_birth, town, area, district,
    mobile, photo_url, gender, member_category, membership_number,
    voter_id, ward_circle, part_number, status, created_at
  FROM public.bla_members
  ORDER BY created_at DESC
) t;
```

Copy the result, paste into a new file called `members-data.json`, and save it in `d:\USER\tvk\`.

---

## Why This Works
✅ **Instant Loading**: Data loads from local file (milliseconds vs minutes)  
✅ **No Timeout**: No database queries = no timeouts  
✅ **All Features Work**: Filters, search, PDF export, Excel export all work  
✅ **Easy Updates**: Just re-export when you add new members

---

**Status**: ⏳ Waiting for you to export data from Supabase dashboard

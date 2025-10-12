# 🚀 Quick Migration Guide: District → Town

## ⚡ Run This Now

### 1️⃣ Database Migration (Supabase)

**Option A: Using Supabase Dashboard**
1. Go to https://supabase.com
2. Open your project
3. Click "SQL Editor" in left menu
4. Create new query
5. Paste this SQL:

```sql
-- Rename district column to town
ALTER TABLE public.bla_members 
RENAME COLUMN district TO town;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bla_members' 
AND column_name = 'town';
```

6. Click "Run" button
7. Check that it returns: `column_name: town, data_type: character varying, is_nullable: NO`

**Option B: Using Local Migration File**
```bash
# Navigate to your project folder
cd d:\USER\tvk

# Run the migration (if you have psql installed)
psql -h db.YOURPROJECT.supabase.co -U postgres -d postgres -f rename-district-to-town.sql
```

### 2️⃣ Verify Code Changes

All code has been updated! Check these files:
```
✅ database-schema.sql - Schema updated
✅ admin-dashboard.html - All UI and queries updated
✅ bla-registration.html - Form field updated
✅ bla-registration.js - Form processing updated
✅ bla-office-entry.js - Data submission updated
```

### 3️⃣ Test the Changes

**Quick Test:**
1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
2. Open admin dashboard
3. Scroll to "Reports & Data Export" section
4. Look for "நகரம் (Town)" label (not "மாவட்டம்")
5. Apply town filter and export

**If you see "நகரம் (Town)"** → ✅ Success!
**If you still see "மாவட்டம் (District)"** → ❌ Clear browser cache and refresh

---

## 📋 What Was Changed?

### Database:
```sql
Before: district VARCHAR(100) NOT NULL
After:  town VARCHAR(100) NOT NULL
```

### User Interface:
```
Before: மாவட்டம் (District)
After:  நகரம் (Town)
```

### All Updated Locations:
- ✅ Filter labels
- ✅ Table headers
- ✅ PDF exports
- ✅ Excel exports
- ✅ Form fields
- ✅ JavaScript queries
- ✅ Data access

---

## ⚠️ Troubleshooting

### Issue: Database error "column district does not exist"
**Solution:** You haven't run the database migration yet. Follow Step 1 above.

### Issue: Still shows "மாவட்டம்" in UI
**Solution:** Clear browser cache:
- Chrome: Ctrl+Shift+Delete → Clear cache
- Firefox: Ctrl+Shift+Delete → Clear cache
- Edge: Ctrl+Shift+Delete → Clear cache

### Issue: Filter not working
**Solution:** 
1. Check browser console (F12) for errors
2. Verify database migration completed
3. Refresh the page

---

## 🎯 Success Criteria

Your migration is successful when:
- [x] Database column is named `town`
- [x] Admin dashboard shows "நகரம் (Town)"
- [x] Town filter works correctly
- [x] PDF export shows "Town" header
- [x] Excel export shows "Town" column
- [x] Registration form shows "நகரம்"
- [x] No console errors

---

## 🔄 Rollback (If Needed)

If something goes wrong, rollback with:

```sql
-- Revert database change
ALTER TABLE public.bla_members 
RENAME COLUMN town TO district;
```

Then restore the old files from Git:
```bash
git checkout main -- admin-dashboard.html bla-registration.html bla-registration.js bla-office-entry.js
```

---

## 📞 Need Help?

Check these files for details:
1. `DISTRICT_TO_TOWN_MIGRATION.md` - Full migration documentation
2. `rename-district-to-town.sql` - Migration SQL script

---

**Ready?** Run Step 1 (Database Migration) now! 🚀

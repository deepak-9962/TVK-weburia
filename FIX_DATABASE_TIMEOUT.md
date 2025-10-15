# 🔥 URGENT: Fix Database Timeout Issue

## The Problem
Your Supabase database queries are timing out with error code 57014. This is caused by Row Level Security (RLS) policies blocking anonymous access.

## The Solution (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: **cbcuhojwffwppocnoxel**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL Script
Copy and paste the entire script below, then click **RUN**:

```sql
-- COMPLETE RLS RESET FOR bla_members TABLE

-- Step 1: Drop ALL policies
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'bla_members'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.bla_members', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 2: Disable RLS
ALTER TABLE public.bla_members DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant public access
GRANT ALL ON public.bla_members TO anon;
GRANT ALL ON public.bla_members TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Verify (you should see these results)
-- Result 1: RLS Status should be "DISABLED ✓"
SELECT 
    'RLS Status' as check_type,
    CASE WHEN relrowsecurity THEN 'ENABLED ❌' ELSE 'DISABLED ✓' END as status
FROM pg_class 
WHERE relname = 'bla_members';

-- Result 2: Policy Count should be "0 policies"
SELECT 
    'Policy Count' as check_type,
    COUNT(*)::text || ' policies' as status
FROM pg_policies 
WHERE tablename = 'bla_members';

-- Result 3: Should show permissions granted
SELECT 
    'Table Permissions' as check_type,
    string_agg(privilege_type, ', ') as status
FROM information_schema.table_privileges
WHERE table_name = 'bla_members' 
AND grantee = 'anon';

-- Result 4: Should return the member count (90)
SELECT COUNT(*) as total_members FROM public.bla_members;
```

### Step 3: Verify Results
After running the script, you should see 4 result tables:

1. **RLS Status**: Should show "DISABLED ✓"
2. **Policy Count**: Should show "0 policies"
3. **Table Permissions**: Should list granted permissions
4. **Total Members**: Should show count (90)

### Step 4: Refresh Your Page
1. Go back to http://localhost:3000/member-photos.html
2. Press **Ctrl + F5** to hard refresh
3. Member cards should now load with all data!

---

## Why This Happens
- Supabase enables RLS by default for security
- Free tier has limited performance
- RLS policies + complex queries = timeout
- We're disabling RLS since this is internal admin tool

## Alternative: Use Static JSON (if still having issues)
If the timeout persists even after running SQL:

1. Export data manually from Supabase dashboard
2. Save as `members-data.json` in the project folder
3. Update page to load from JSON file instead

---

**Status**: ⏳ Waiting for you to run the SQL script in Supabase

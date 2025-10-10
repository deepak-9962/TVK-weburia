-- Quick Database Verification Script
-- Run this to check the current state of your bla_members table

-- Check if bla_members table exists
SELECT 
    'bla_members table' AS check_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bla_members')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status;

-- Check all columns in bla_members table
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bla_members'
ORDER BY ordinal_position;

-- Check for specific important columns
SELECT 
    'religion column' AS check_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'religion')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status
UNION ALL
SELECT 
    'ward_circle column' AS check_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'ward_circle')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status
UNION ALL
SELECT 
    'registered_by_employee_id column' AS check_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status
UNION ALL
SELECT 
    'address nullable' AS check_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'address' AND is_nullable = 'YES')
        THEN '✅ NULLABLE'
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'address' AND is_nullable = 'NO')
        THEN '⚠️ NOT NULL (needs migration)'
        ELSE '❌ COLUMN MISSING'
    END AS status;

-- Check indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE tablename = 'bla_members'
ORDER BY indexname;

-- Check foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'bla_members';

-- Count existing records
SELECT 
    'Total BLA Members' AS metric,
    COUNT(*) AS count
FROM public.bla_members
UNION ALL
SELECT 
    'Members with religion data' AS metric,
    COUNT(*) AS count
FROM public.bla_members
WHERE religion IS NOT NULL
UNION ALL
SELECT 
    'Members with address data' AS metric,
    COUNT(*) AS count
FROM public.bla_members
WHERE address IS NOT NULL
UNION ALL
SELECT 
    'Members with ward_circle data' AS metric,
    COUNT(*) AS count
FROM public.bla_members
WHERE ward_circle IS NOT NULL;

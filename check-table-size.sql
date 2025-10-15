-- Investigate why bla_members table is so large (242 MB)
-- Run this to find out what's taking up space

-- Check total row count
SELECT 
    'Total Members' as metric,
    COUNT(*)::text as value
FROM public.bla_members;

-- Check average row size
SELECT 
    'Average Row Size' as metric,
    pg_size_pretty(
        pg_total_relation_size('public.bla_members')::numeric / 
        NULLIF(COUNT(*), 0)
    ) as value
FROM public.bla_members;

-- Check table size breakdown
SELECT
    'Table Data' as component,
    pg_size_pretty(pg_table_size('public.bla_members')) as size
UNION ALL
SELECT
    'Indexes',
    pg_size_pretty(pg_indexes_size('public.bla_members'))
UNION ALL
SELECT
    'Total (with TOAST)',
    pg_size_pretty(pg_total_relation_size('public.bla_members'));

-- Check for large text/blob columns
SELECT 
    'Text Columns Size' as metric,
    pg_size_pretty(
        SUM(
            COALESCE(pg_column_size(full_name), 0) +
            COALESCE(pg_column_size(father_name), 0) +
            COALESCE(pg_column_size(photo_url), 0) +
            COALESCE(pg_column_size(mobile), 0) +
            COALESCE(pg_column_size(town), 0) +
            COALESCE(pg_column_size(voter_id), 0)
        )::bigint
    ) as value
FROM public.bla_members;

-- Check if photo_url contains large base64 data
SELECT 
    'Members with Long Photo URLs' as metric,
    COUNT(*) as count
FROM public.bla_members
WHERE LENGTH(photo_url) > 1000;

-- Show sample of photo URLs to see if they're base64 encoded
SELECT 
    id,
    full_name,
    LENGTH(photo_url) as url_length,
    LEFT(photo_url, 100) as url_sample
FROM public.bla_members
WHERE photo_url IS NOT NULL
ORDER BY LENGTH(photo_url) DESC
LIMIT 10;

-- Check for any JSONB or large text columns
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'bla_members'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are duplicate rows
SELECT 
    'Duplicate Check' as metric,
    COUNT(*) - COUNT(DISTINCT (full_name, father_name, mobile)) as duplicates
FROM public.bla_members;

-- Check total database size
SELECT
    pg_size_pretty(pg_database_size(current_database())) as total_db_size;

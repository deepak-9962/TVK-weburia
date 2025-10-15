-- Add/verify indexes on bla_members table to improve query performance
-- Run this in Supabase SQL Editor

-- Check current statement timeout
SHOW statement_timeout;

-- Temporarily increase timeout for this session (optional)
-- SET statement_timeout = '30s';

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'bla_members';
-- Should show: rowsecurity = false

-- Check table size
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    (SELECT COUNT(*) FROM bla_members) as row_count
FROM pg_tables
WHERE tablename = 'bla_members';

-- List existing indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'bla_members'
ORDER BY indexname;

-- Test a simple query
SELECT COUNT(*) FROM bla_members;

-- Test query with LIMIT (should be fast)
SELECT id, full_name, photo_url 
FROM bla_members 
LIMIT 10;

-- If the above works, try with more columns
SELECT id, full_name, photo_url, town, gender, member_category, created_at
FROM bla_members 
LIMIT 50;

-- Check for any long-running queries
SELECT 
    pid,
    now() - query_start as duration,
    state,
    query
FROM pg_stat_activity
WHERE state != 'idle'
  AND query NOT LIKE '%pg_stat_activity%'
ORDER BY duration DESC;

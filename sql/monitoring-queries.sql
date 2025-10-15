-- ================================================================
-- DATABASE MONITORING & DIAGNOSTICS
-- ================================================================
-- Use these queries to monitor performance and diagnose issues

-- ================================================================
-- 1. CHECK INDEX USAGE
-- ================================================================

-- Show all indexes on bla_members table
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'bla_members' 
ORDER BY indexname;

-- Show index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes 
WHERE tablename IN ('bla_members', 'employees', 'admins')
ORDER BY idx_scan DESC;

-- Find unused indexes (candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
  AND indexrelid IS NOT NULL
  AND tablename IN ('bla_members', 'employees', 'admins')
ORDER BY pg_relation_size(indexrelid) DESC;

-- ================================================================
-- 2. CHECK TABLE SIZES
-- ================================================================

-- Show table and index sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size,
    pg_total_relation_size(schemaname||'.'||tablename) as bytes
FROM pg_tables 
WHERE tablename IN ('bla_members', 'employees', 'admins')
ORDER BY bytes DESC;

-- Row counts
SELECT 
    schemaname,
    relname as tablename,
    n_live_tup as row_count,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables 
WHERE relname IN ('bla_members', 'employees', 'admins')
ORDER BY n_live_tup DESC;

-- ================================================================
-- 3. CHECK SLOW QUERIES (requires pg_stat_statements)
-- ================================================================

-- Enable extension if not already enabled
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Show slowest queries
SELECT 
    substring(query, 1, 100) as query_preview,
    calls,
    round(total_exec_time::numeric, 2) as total_time_ms,
    round(mean_exec_time::numeric, 2) as avg_time_ms,
    round(max_exec_time::numeric, 2) as max_time_ms,
    round((total_exec_time / sum(total_exec_time) OVER()) * 100, 2) as percent_of_total
FROM pg_stat_statements 
WHERE query NOT LIKE '%pg_stat%'
  AND query LIKE '%bla_members%'
ORDER BY mean_exec_time DESC 
LIMIT 20;

-- ================================================================
-- 4. CHECK QUERY PLAN (to see if indexes are being used)
-- ================================================================

-- Example: Check if created_at index is used
EXPLAIN ANALYZE 
SELECT id, full_name, photo_url, town 
FROM bla_members 
ORDER BY created_at DESC 
LIMIT 200;

-- Look for:
-- ✅ "Index Scan using idx_bla_members_created_at" = GOOD
-- ❌ "Seq Scan on bla_members" = BAD (full table scan)

-- Example: Check filtered query
EXPLAIN ANALYZE 
SELECT id, full_name, photo_url 
FROM bla_members 
WHERE town = 'Chennai' 
  AND gender = 'male'
ORDER BY created_at DESC 
LIMIT 100;

-- ================================================================
-- 5. CHECK DATABASE HEALTH
-- ================================================================

-- Check for bloat (dead rows that need vacuuming)
SELECT 
    schemaname,
    relname,
    n_live_tup,
    n_dead_tup,
    round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_percent,
    last_autovacuum
FROM pg_stat_user_tables 
WHERE n_dead_tup > 1000
  AND relname IN ('bla_members', 'employees', 'admins')
ORDER BY dead_percent DESC;

-- Check for missing indexes (columns frequently used in WHERE but no index)
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename IN ('bla_members', 'employees', 'admins')
  AND n_distinct > 100  -- High cardinality
  AND correlation < 0.5 -- Random order
ORDER BY tablename, n_distinct DESC;

-- ================================================================
-- 6. CONNECTION AND LOCK MONITORING
-- ================================================================

-- Show current connections
SELECT 
    datname,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    substring(query, 1, 100) as current_query
FROM pg_stat_activity 
WHERE datname = current_database()
  AND state != 'idle'
ORDER BY query_start;

-- Show locks
SELECT 
    locktype,
    relation::regclass,
    mode,
    granted,
    pid
FROM pg_locks
WHERE relation = 'bla_members'::regclass;

-- ================================================================
-- 7. CACHE HIT RATIO (should be >99%)
-- ================================================================

SELECT 
    'bla_members' as table_name,
    heap_blks_read as disk_reads,
    heap_blks_hit as cache_hits,
    round(
        heap_blks_hit * 100.0 / NULLIF(heap_blks_hit + heap_blks_read, 0),
        2
    ) as cache_hit_ratio_percent
FROM pg_statio_user_tables 
WHERE relname = 'bla_members';

-- Overall database cache hit ratio
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    round(
        sum(heap_blks_hit) * 100.0 / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0),
        2
    ) as cache_hit_ratio_percent
FROM pg_statio_user_tables;

-- ================================================================
-- 8. MAINTENANCE COMMANDS
-- ================================================================

-- Analyze tables to update statistics (run after adding indexes)
ANALYZE bla_members;
ANALYZE employees;
ANALYZE admins;

-- Vacuum to reclaim space and update statistics
VACUUM ANALYZE bla_members;
VACUUM ANALYZE employees;
VACUUM ANALYZE admins;

-- Reindex if indexes are corrupted or bloated
REINDEX TABLE bla_members;

-- ================================================================
-- 9. QUICK HEALTH CHECK
-- ================================================================

-- Run this one query to get overall health status
SELECT 
    'Table Size' as metric,
    pg_size_pretty(pg_total_relation_size('bla_members')) as value
UNION ALL
SELECT 
    'Row Count',
    n_live_tup::text
FROM pg_stat_user_tables WHERE relname = 'bla_members'
UNION ALL
SELECT 
    'Index Count',
    COUNT(*)::text
FROM pg_indexes WHERE tablename = 'bla_members'
UNION ALL
SELECT 
    'Cache Hit Ratio',
    round(heap_blks_hit * 100.0 / NULLIF(heap_blks_hit + heap_blks_read, 0), 2)::text || '%'
FROM pg_statio_user_tables WHERE relname = 'bla_members'
UNION ALL
SELECT 
    'Dead Rows %',
    round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2)::text || '%'
FROM pg_stat_user_tables WHERE relname = 'bla_members';

-- ================================================================
-- EXPECTED GOOD VALUES:
-- ================================================================
-- Index Count: 10+ indexes
-- Cache Hit Ratio: >99%
-- Dead Rows %: <5%
-- Query time (EXPLAIN): <100ms
-- ================================================================
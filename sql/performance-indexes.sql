-- ================================================================
-- CRITICAL DATABASE PERFORMANCE INDEXES
-- ================================================================
-- Run these in Supabase SQL Editor to fix timeout issues
-- Execution time: ~30-60 seconds for all indexes

-- ================================================================
-- 0. ENABLE REQUIRED EXTENSIONS
-- ================================================================

-- Enable pg_trgm extension for text search (required for full-text search index)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================================
-- 1. BLA MEMBERS TABLE - MOST CRITICAL
-- ================================================================

-- Primary index for chronological queries (CRITICAL - fixes timeouts!)
CREATE INDEX IF NOT EXISTS idx_bla_members_created_at 
ON public.bla_members (created_at DESC);

-- Composite index for filtered queries (town + date)
-- Using LEFT() to prevent index size errors on long text values
CREATE INDEX IF NOT EXISTS idx_bla_members_town_created_at 
ON public.bla_members (LEFT(town, 100), created_at DESC) 
WHERE town IS NOT NULL;

-- Gender filter index
CREATE INDEX IF NOT EXISTS idx_bla_members_gender 
ON public.bla_members (gender) 
WHERE gender IS NOT NULL;

-- Status filter index
CREATE INDEX IF NOT EXISTS idx_bla_members_status 
ON public.bla_members (status);

-- Category filter index
CREATE INDEX IF NOT EXISTS idx_bla_members_category 
ON public.bla_members (member_category) 
WHERE member_category IS NOT NULL;

-- Full-text search on names (for search functionality)
-- Using LEFT() to limit text length and avoid index size errors
CREATE INDEX IF NOT EXISTS idx_bla_members_full_name_trgm 
ON public.bla_members USING gin (LEFT(full_name, 100) gin_trgm_ops)
WHERE full_name IS NOT NULL;

-- Simple pattern matching index for exact name lookups
CREATE INDEX IF NOT EXISTS idx_bla_members_full_name_lower
ON public.bla_members (LOWER(LEFT(full_name, 255)))
WHERE full_name IS NOT NULL;

-- Employee relationship index
CREATE INDEX IF NOT EXISTS idx_bla_members_registered_by 
ON public.bla_members (registered_by_employee_id) 
WHERE registered_by_employee_id IS NOT NULL;

-- Voter ID lookup index (limited length)
CREATE INDEX IF NOT EXISTS idx_bla_members_voter_id 
ON public.bla_members (LEFT(voter_id, 50)) 
WHERE voter_id IS NOT NULL;

-- Photo availability index (limited length for URLs)
CREATE INDEX IF NOT EXISTS idx_bla_members_has_photo 
ON public.bla_members (LEFT(photo_url, 255)) 
WHERE photo_url IS NOT NULL;

-- ================================================================
-- 2. EMPLOYEES TABLE
-- ================================================================

-- Email lookup (for login) - limited length for safety
CREATE INDEX IF NOT EXISTS idx_employees_email 
ON public.employees (LEFT(email, 255));

-- Employee ID lookup - limited length for safety
CREATE INDEX IF NOT EXISTS idx_employees_employee_id 
ON public.employees (LEFT(employee_id, 100));

-- Status filter
CREATE INDEX IF NOT EXISTS idx_employees_status 
ON public.employees (status);

-- ================================================================
-- 3. ADMINS TABLE
-- ================================================================

-- Username lookup (for login) - limited length for safety
CREATE INDEX IF NOT EXISTS idx_admins_username 
ON public.admins (LEFT(username, 255));

-- Email lookup - limited length for safety
CREATE INDEX IF NOT EXISTS idx_admins_email 
ON public.admins (LEFT(email, 255)) 
WHERE email IS NOT NULL;

-- Status filter
CREATE INDEX IF NOT EXISTS idx_admins_status 
ON public.admins (status);

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
-- Run these after creating indexes to verify they exist:

-- Check all indexes on bla_members
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'bla_members';

-- Check index sizes
-- SELECT schemaname, tablename, indexname, 
--        pg_size_pretty(pg_relation_size(indexrelid)) as index_size
-- FROM pg_stat_user_indexes 
-- WHERE tablename IN ('bla_members', 'employees', 'admins')
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- ================================================================
-- EXPECTED PERFORMANCE IMPROVEMENTS
-- ================================================================
-- Before indexes:
--   - Queries: 5-10+ seconds (timeout)
--   - Full table scans on every query
--   - Cannot handle concurrent users
--
-- After indexes:
--   - Queries: <100ms (50-100x faster!)
--   - Index seeks instead of scans
--   - Can handle 100+ concurrent users
-- ================================================================

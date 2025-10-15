# Database Structure Optimization Guide

## 🎯 Overview
This guide explains how to optimize your database structure for maximum performance, especially under high traffic loads.

---

## 🚨 Critical Issues Identified

### 1. **Missing Indexes** (SEVERITY: CRITICAL)
**Problem:**
- No indexes on frequently queried columns
- Every query performs a full table scan
- Queries timeout after 5 seconds

**Impact:**
- Member photos page: UNUSABLE
- Search functionality: EXTREMELY SLOW
- Cannot handle >10 concurrent users

**Solution:**
- Run `sql/performance-indexes.sql` immediately
- Expected improvement: **50-100x faster queries**

---

### 2. **Inefficient Query Patterns** (SEVERITY: HIGH)
**Problem:**
- Using `SELECT *` instead of specific columns
- No query result caching
- Client-side filtering on large datasets

**Solution:**
- ✅ Already implemented: Select only needed columns
- ✅ Already implemented: Server-side filtering
- TODO: Add Redis/caching layer for frequently accessed data

---

### 3. **No Table Partitioning** (SEVERITY: MEDIUM)
**Problem:**
- Large `bla_members` table will grow indefinitely
- Queries slow down as table grows (>100k rows)

**Solution:**
- Implement monthly/yearly partitioning on `created_at`
- Archive old data to separate tables
- See "Advanced Optimization" section below

---

### 4. **Plain Text Passwords** (SEVERITY: CRITICAL - SECURITY)
**Problem:**
- Passwords stored in plain text in `employees` and `admins` tables
- Major security vulnerability

**Solution:**
- Migrate to Supabase Auth (see `AUTH_MIGRATION_GUIDE.md`)
- Use bcrypt/argon2 password hashing
- Implement proper session management

---

## ⚡ Immediate Actions (< 5 minutes)

### Step 1: Add Critical Indexes

Run this in **Supabase SQL Editor**:

```sql
-- CRITICAL: Run sql/performance-indexes.sql
-- Or copy-paste the contents of that file
```

**Expected Results:**
- Query time: 5-10+ seconds → <100ms
- Page load: TIMEOUT → INSTANT
- Concurrent users: 5 → 100+

---

### Step 2: Enable pg_trgm Extension (for search)

```sql
-- Enable trigram extension for fast text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

### Step 3: Verify Indexes Exist

```sql
-- Check indexes on bla_members
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'bla_members' 
ORDER BY indexname;
```

**Expected Output:**
- Should see 10+ indexes listed
- `idx_bla_members_created_at` is the MOST CRITICAL

---

## 📊 Performance Monitoring Queries

### Check Query Performance

```sql
-- Show slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements 
WHERE query LIKE '%bla_members%'
ORDER BY mean_time DESC 
LIMIT 10;
```

### Check Index Usage

```sql
-- See which indexes are being used
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE tablename IN ('bla_members', 'employees', 'admins')
ORDER BY idx_scan DESC;
```

### Check Table Sizes

```sql
-- Monitor table and index sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables 
WHERE tablename IN ('bla_members', 'employees', 'admins')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🏗️ Advanced Optimization (When Needed)

### 1. Table Partitioning (For >100k members)

```sql
-- Create partitioned table (example for yearly partitioning)
CREATE TABLE bla_members_partitioned (
    LIKE bla_members INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create partitions for each year
CREATE TABLE bla_members_2024 PARTITION OF bla_members_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE bla_members_2025 PARTITION OF bla_members_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Migrate data
INSERT INTO bla_members_partitioned SELECT * FROM bla_members;

-- Rename tables (after testing!)
-- ALTER TABLE bla_members RENAME TO bla_members_old;
-- ALTER TABLE bla_members_partitioned RENAME TO bla_members;
```

**Benefits:**
- Queries only scan relevant partition
- Easy to archive old data
- Maintenance operations are faster

---

### 2. Materialized Views (For Complex Aggregations)

```sql
-- Create materialized view for statistics
CREATE MATERIALIZED VIEW member_stats AS
SELECT 
    date_trunc('month', created_at) as month,
    town,
    gender,
    member_category,
    COUNT(*) as member_count,
    COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as with_photo_count
FROM bla_members
GROUP BY date_trunc('month', created_at), town, gender, member_category;

-- Create index on materialized view
CREATE INDEX idx_member_stats_month ON member_stats (month);

-- Refresh periodically (daily or hourly)
REFRESH MATERIALIZED VIEW member_stats;
```

**Benefits:**
- Pre-computed aggregations
- Dashboard loads instantly
- Reduces load on main table

---

### 3. Connection Pooling

**Problem:**
- Too many database connections from browser
- Connection overhead on each request

**Solution:**
- Use Supabase connection pooler (already available)
- Configure in `supabase-config.js`:

```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app' },
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});
```

---

### 4. Query Result Caching

**Server-side caching (Supabase Edge Functions):**

```typescript
// edge-functions/cached-members.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CACHE_DURATION = 60; // 60 seconds

serve(async (req) => {
  const cacheKey = 'members:recent:200';
  
  // Try cache first (implement with Deno KV or Redis)
  let data = await getFromCache(cacheKey);
  
  if (!data) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { data: members } = await supabase
      .from('bla_members')
      .select('id, full_name, photo_url, town, gender')
      .order('created_at', { ascending: false })
      .limit(200);
    
    data = members;
    await setCache(cacheKey, data, CACHE_DURATION);
  }
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## 📋 Optimization Checklist

### Immediate (Do Now)
- [ ] Run `sql/performance-indexes.sql` in Supabase SQL Editor
- [ ] Enable `pg_trgm` extension
- [ ] Verify indexes with monitoring queries
- [ ] Test member-photos page (should load <1 second)
- [ ] Test with 10+ concurrent browser tabs

### Short-term (This Week)
- [ ] Migrate to Supabase Auth (`AUTH_MIGRATION_GUIDE.md`)
- [ ] Set up monitoring dashboard (query times, index usage)
- [ ] Implement server-side caching for frequently accessed data
- [ ] Add database backups (automated daily)

### Medium-term (This Month)
- [ ] Create materialized views for dashboard statistics
- [ ] Implement table partitioning if >100k members
- [ ] Add full-text search with pg_trgm
- [ ] Optimize images (compress, resize, CDN)

### Long-term (As Needed)
- [ ] Consider read replicas for very high traffic
- [ ] Implement data archival strategy
- [ ] Add Redis/Memcached layer
- [ ] Database connection pooling optimization

---

## 🎯 Expected Performance After Optimization

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Page Load Time** | 10+ sec (timeout) | <1 sec | **10x+** |
| **Query Execution** | 5-10 sec | 50-100ms | **100x** |
| **Concurrent Users** | 5-10 | 100-500 | **50x** |
| **Database CPU** | 80-100% | 10-20% | **5x better** |
| **Memory Usage** | High (full scans) | Low (index seeks) | **10x better** |

---

## 🔍 Troubleshooting

### "Queries still slow after adding indexes"

**Check 1:** Verify indexes exist
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'bla_members';
```

**Check 2:** Check if indexes are being used
```sql
EXPLAIN ANALYZE 
SELECT * FROM bla_members 
ORDER BY created_at DESC 
LIMIT 100;
```

Look for "Index Scan" not "Seq Scan"

**Check 3:** Run ANALYZE
```sql
ANALYZE bla_members;
```

---

### "Out of memory errors"

**Solution:** Limit result sets
```javascript
// Always use .limit()
.limit(200)  // Don't fetch more than needed
```

---

### "Index creation taking too long"

**Normal:** Large tables can take 30-60 seconds per index

**Optimization:** Create indexes concurrently
```sql
CREATE INDEX CONCURRENTLY idx_name ON table (column);
```

---

## 📚 Additional Resources

- [Supabase Performance Tips](https://supabase.com/docs/guides/database/performance)
- [PostgreSQL Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)
- [Query Optimization Guide](https://www.postgresql.org/docs/current/performance-tips.html)

---

## 💡 Quick Wins Summary

1. **Add indexes** (5 min) → **100x faster queries**
2. **Enable pg_trgm** (1 min) → **Fast text search**
3. **Select specific columns** (already done) → **Less data transfer**
4. **Server-side filtering** (already done) → **Less processing**
5. **Add LIMIT clauses** (already done) → **Controlled result sets**

**Total time to implement: ~10 minutes**
**Expected improvement: Page goes from BROKEN to INSTANT**

---

**Next Step:** Open Supabase SQL Editor and run `sql/performance-indexes.sql` NOW!
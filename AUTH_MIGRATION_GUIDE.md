# Supabase Auth Migration Guide (Employees + Admins)

This guide explains why moving from app-managed plaintext passwords to Supabase Auth is important, and how to migrate safely without downtime.

## Why migrate
- Security: Plaintext passwords in your tables are a critical risk. Auth provides password hashing, rate limiting, sessions, OTP, etc.
- RLS: Auth integrates with Row Level Security using `auth.uid()` for safe data access per user/role.
- Observability: Centralized auth logs and policies.
- Easier clients: Use `supabase.auth.signInWithPassword(...)` instead of manual queries.

Note: The member-photos timeout is not caused by missing Auth. It was fixed via pagination/indexing. Migration is for security and maintainability.

---

## Target design
- Tables: `employees`, `admins`
- New column in each: `auth_user_id uuid unique` referencing `auth.users(id)`
- Login flows:
  - Employees: Email + password (Supabase Auth)
  - Admins: Email + password (or keep username, but store an email for auth login)
- Keep legacy password temporarily for rollback; remove later.

---

## Phased migration plan

1) Prep (safe, no user impact)
- Add `auth_user_id` to `employees` and `admins` (see `sql/add-auth-columns.sql`).
- Add performance index for `bla_members.created_at` (see `sql/performance-indexes.sql`).

2) Create Auth users and link
- Use service role key to create users in `auth.users` and set `auth_user_id` on rows.
- Scripts provided: `tools/migrate-employees-to-auth.js`, `tools/migrate-admins-to-auth.js`.

3) Update app login
- Switch office/admin/employee login to `supabase.auth.signInWithPassword({ email, password })`.
- After login, query `employees`/`admins` by `auth_user_id = auth.uid()`.

4) Enable RLS policies (optional now, recommended soon)
- Grant SELECT/UPDATE to logged-in users based on `auth.uid()`.
- Deny anon where appropriate.

5) Decommission legacy passwords
- After verification window, drop `password` columns.

Rollback: You can still use legacy logins while Auth is wired. Only cut over after testing.

---

## Minimal code changes (example)

Login (employees):
```js
// Old
const { data } = await supabase.from('employees').select('*').eq('email', email).single();
// password compare in app

// New
const { data: session, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;
const { data: emp } = await supabase.from('employees').select('id, full_name, status, auth_user_id').eq('auth_user_id', session.user.id).single();
```

Admins are analogous. Ensure each admin has an email to create the Auth user.

---

## How to run migration scripts

1) Install Node dependencies:
```
# from repo root
npm init -y
npm install @supabase/supabase-js@2
```

2) Set environment variables (Windows PowerShell):
```
$env:SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"
```

3) Run employees then admins:
```
node tools/migrate-employees-to-auth.js
node tools/migrate-admins-to-auth.js
```

These scripts:
- Create auth users if missing
- Set `auth_user_id` on the table
- Skip rows already migrated

---

## RLS policy starter (optional)
```sql
-- Example read policy for employees table
alter table public.employees enable row level security;
create policy employees_self_read on public.employees
for select to authenticated
using (auth.uid() = auth_user_id);
```

---

## Performance: member-photos
To handle high traffic, ensure this index exists:
```sql
create index if not exists idx_bla_members_created_at on public.bla_members (created_at desc);
```
Then rely on the built-in pagination in `member-photos.html`.

---

## Checklist
- [ ] Run `sql/add-auth-columns.sql`
- [ ] Run `sql/performance-indexes.sql`
- [ ] Run migration scripts (employees/admins)
- [ ] Switch app logins to `supabase.auth.*`
- [ ] Add RLS policies
- [ ] Remove legacy plaintext passwords

Need help wiring the login pages to Auth? I can update `office-login.js`, `employee-auth.js`, and admin login in one go once the migration is complete.

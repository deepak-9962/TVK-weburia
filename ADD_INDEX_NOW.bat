@echo off
echo.
echo =====================================
echo  CRITICAL: Add Database Index
echo =====================================
echo.
echo This index is REQUIRED to fix timeouts!
echo Please run this SQL in Supabase SQL Editor:
echo.
echo CREATE INDEX IF NOT EXISTS idx_bla_members_created_at 
echo ON public.bla_members (created_at DESC);
echo.
echo Steps:
echo 1. Go to your Supabase Dashboard
echo 2. Click "SQL Editor" 
echo 3. Paste the CREATE INDEX command above
echo 4. Click "Run"
echo.
echo Without this index, queries will timeout under load!
echo.
pause
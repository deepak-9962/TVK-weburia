-- Query 3: Check if RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'bla_members';

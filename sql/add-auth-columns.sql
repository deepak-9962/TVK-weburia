-- Add auth_user_id columns and constraints
alter table if exists public.employees
    add column if not exists auth_user_id uuid unique;

alter table if exists public.admins
    add column if not exists auth_user_id uuid unique;

-- Optional: enforce FK once all rows are populated
-- alter table public.employees add constraint employees_auth_user_id_fkey foreign key (auth_user_id) references auth.users(id) on delete set null;
-- alter table public.admins add constraint admins_auth_user_id_fkey foreign key (auth_user_id) references auth.users(id) on delete set null;

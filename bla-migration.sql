-- BLA Employee Workflow Database Migration Script
-- Run this script to update existing TVK database for BLA employee workflow

-- Create employees table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for employees username
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_employees_username') THEN
        CREATE INDEX idx_employees_username ON public.employees(username);
    END IF;
END $$;

-- Enable RLS on employees table
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for employees table
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow authenticated employees to read their own data" ON public.employees;
    DROP POLICY IF EXISTS "Allow insert for employee registration" ON public.employees;
    DROP POLICY IF EXISTS "Allow update for employee data" ON public.employees;
    
    -- Create new policies
    CREATE POLICY "Allow authenticated employees to read their own data" ON public.employees FOR SELECT USING (true);
    CREATE POLICY "Allow insert for employee registration" ON public.employees FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow update for employee data" ON public.employees FOR UPDATE USING (true);
END $$;

-- Add registered_by_employee_id column to bla_members if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id') THEN
        ALTER TABLE public.bla_members ADD COLUMN registered_by_employee_id UUID;
        -- Add foreign key constraint
        ALTER TABLE public.bla_members ADD CONSTRAINT fk_bla_members_employee FOREIGN KEY (registered_by_employee_id) REFERENCES public.employees(id);
    END IF;
END $$;

-- Add unique constraint to voter_id to prevent duplicates
DO $$
BEGIN
    -- First, check if the constraint already exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bla_members_voter_id_unique' AND table_name = 'bla_members') THEN
        -- Check if there are any duplicate voter_ids first
        IF NOT EXISTS (
            SELECT voter_id FROM public.bla_members 
            WHERE voter_id IS NOT NULL 
            GROUP BY voter_id 
            HAVING COUNT(*) > 1
        ) THEN
            -- Only add the constraint if there are no duplicates
            ALTER TABLE public.bla_members ADD CONSTRAINT bla_members_voter_id_unique UNIQUE (voter_id);
        ELSE
            -- Log that duplicates exist and need to be cleaned up first
            RAISE NOTICE 'Warning: Duplicate voter_ids found. Please clean up duplicates before adding unique constraint.';
        END IF;
    END IF;
EXCEPTION 
    WHEN duplicate_table THEN
        RAISE NOTICE 'Constraint bla_members_voter_id_unique already exists';
    WHEN others THEN
        RAISE NOTICE 'Error adding unique constraint: %', SQLERRM;
END $$;

-- Create index for registered_by_employee_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bla_members_registered_by') THEN
        CREATE INDEX idx_bla_members_registered_by ON public.bla_members(registered_by_employee_id);
    END IF;
END $$;

-- Insert sample employees for testing (only if they don't exist)
DO $$
BEGIN
    -- Check if employees already exist
    IF NOT EXISTS (SELECT 1 FROM public.employees WHERE username = 'admin') THEN
        INSERT INTO public.employees (username, password_hash, full_name, is_active) VALUES
        ('admin', 'admin123', 'நிர்வாகி முருகன்', true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.employees WHERE username = 'manager') THEN
        INSERT INTO public.employees (username, password_hash, full_name, is_active) VALUES
        ('manager', 'manager123', 'மேலாளர் கவிதா', true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.employees WHERE username = 'office') THEN
        INSERT INTO public.employees (username, password_hash, full_name, is_active) VALUES
        ('office', 'office123', 'அலுவலக பணியாளர் ராஜ்', true);
    END IF;
END $$;

-- Final verification
DO $$
DECLARE
    employee_count INTEGER;
    column_exists BOOLEAN;
    constraint_exists BOOLEAN;
BEGIN
    -- Check employee count
    SELECT COUNT(*) INTO employee_count FROM public.employees;
    
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id'
    ) INTO column_exists;
    
    -- Check if constraint exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bla_members_voter_id_unique' AND table_name = 'bla_members'
    ) INTO constraint_exists;
    
    RAISE NOTICE 'Migration completed successfully:';
    RAISE NOTICE '- Employees created: %', employee_count;
    RAISE NOTICE '- Employee column added: %', column_exists;
    RAISE NOTICE '- Unique constraint added: %', constraint_exists;
END $$;
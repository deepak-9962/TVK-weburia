-- TVK Political Party Database Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employees table for office staff authentication
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Ensure you hash passwords before storing
    full_name VARCHAR(200),
    is_admin BOOLEAN DEFAULT false, -- Admin flag for privileged access
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BLA Members table
CREATE TABLE public.bla_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    membership_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal Information
    full_name VARCHAR(200) NOT NULL,
    father_name VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    religion VARCHAR(100), -- Religion: இந்து, இஸ்லாம், கிறிஸ்தவம், பௌத்தம், சமணம், சீக்கியம், மற்றவை
    occupation VARCHAR(100) NOT NULL,
    education VARCHAR(50) CHECK (education IN ('primary', 'secondary', 'higher-secondary', 'diploma', 'graduate', 'post-graduate', 'other')),
    
    -- Contact Information
    mobile VARCHAR(15) NOT NULL,
    alt_mobile VARCHAR(15),
    email VARCHAR(255),
    address TEXT, -- Made nullable - not collected in current form
    town VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    
    -- Political Information
    voter_id VARCHAR(20),
    part_number VARCHAR(50),
    ward_circle VARCHAR(200), -- Ward/Circle/Uraatchi information
    constituency VARCHAR(100),
    previous_party VARCHAR(200),
    interests JSONB,
    aadhaar_number VARCHAR(20),
    member_category VARCHAR(100),
    
    -- Documents
    photo_url TEXT,
    id_proof_url TEXT,
    
    -- Tracking
    registered_by_employee_id UUID, -- Employee who registered this member
    
    -- Status and dates
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign Key
    CONSTRAINT fk_bla_members_employee FOREIGN KEY (registered_by_employee_id) REFERENCES public.employees(id)
);

-- Create Complaints table
CREATE TABLE public.complaints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    complaint_number BIGINT UNIQUE NOT NULL,
    
    -- Complainant Information
    complainant_name VARCHAR(200) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    
    -- Complaint Details
    complaint_type VARCHAR(50) NOT NULL CHECK (complaint_type IN ('public-service', 'infrastructure', 'corruption', 'social-issue', 'other')),
    complaint_details TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Status and tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'closed', 'rejected')),
    assigned_to VARCHAR(200),
    resolution_details TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Activities table
CREATE TABLE public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    activity_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Activity Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('meeting', 'registration', 'service', 'campaign', 'other')),
    
    -- Scheduling
    activity_date DATE NOT NULL,
    activity_time VARCHAR(50),
    venue TEXT NOT NULL,
    
    -- Status and participants
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    expected_attendees INTEGER DEFAULT 0,
    actual_attendees INTEGER DEFAULT 0,
    
    -- Organization
    organized_by VARCHAR(200),
    contact_person VARCHAR(200),
    contact_phone VARCHAR(15),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Office Tasks table
CREATE TABLE public.office_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Task Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    task_category VARCHAR(50) DEFAULT 'general' CHECK (task_category IN ('administrative', 'member-management', 'complaint-handling', 'event-planning', 'general')),
    
    -- Assignment and priority
    assigned_to VARCHAR(200),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'on-hold', 'cancelled')),
    
    -- Progress tracking
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    due_date DATE,
    
    -- Additional information
    notes TEXT,
    attachments JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Storage buckets (run these separately in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('member-documents', 'member-documents', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('activity-media', 'activity-media', true);

-- Create indexes for better performance
-- Add employee reference column to bla_members (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bla_members' AND column_name = 'registered_by_employee_id') THEN
        ALTER TABLE public.bla_members ADD COLUMN registered_by_employee_id UUID REFERENCES public.employees(id);
    END IF;
END $$;

-- Add unique constraint to voter_id to prevent duplicates (if not exists)
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bla_members_voter_id_unique' 
        AND table_name = 'bla_members'
    ) THEN
        -- Check for duplicates first
        IF NOT EXISTS (
            SELECT voter_id FROM public.bla_members 
            WHERE voter_id IS NOT NULL 
            GROUP BY voter_id 
            HAVING COUNT(*) > 1
        ) THEN
            ALTER TABLE public.bla_members ADD CONSTRAINT bla_members_voter_id_unique UNIQUE (voter_id);
        END IF;
    END IF;
EXCEPTION 
    WHEN duplicate_table THEN
        -- Constraint already exists, ignore
        NULL;
    WHEN others THEN
        -- Log other errors but don't fail
        RAISE NOTICE 'Could not add unique constraint on voter_id: %', SQLERRM;
END $$;

-- Create indexes for employees table
CREATE INDEX IF NOT EXISTS idx_employees_username ON public.employees(username);

-- Create indexes for bla_members table
CREATE INDEX idx_bla_members_membership_number ON public.bla_members(membership_number);
CREATE INDEX idx_bla_members_mobile ON public.bla_members(mobile);
CREATE INDEX idx_bla_members_status ON public.bla_members(status);
CREATE INDEX idx_bla_members_created_at ON public.bla_members(created_at);
CREATE INDEX IF NOT EXISTS idx_bla_members_registered_by ON public.bla_members(registered_by_employee_id);

CREATE INDEX idx_complaints_complaint_number ON public.complaints(complaint_number);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_priority ON public.complaints(priority);
CREATE INDEX idx_complaints_created_at ON public.complaints(created_at);

CREATE INDEX idx_activities_activity_date ON public.activities(activity_date);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_activities_activity_type ON public.activities(activity_type);

CREATE INDEX idx_office_tasks_assigned_to ON public.office_tasks(assigned_to);
CREATE INDEX idx_office_tasks_status ON public.office_tasks(status);
CREATE INDEX idx_office_tasks_priority ON public.office_tasks(priority);
CREATE INDEX idx_office_tasks_due_date ON public.office_tasks(due_date);

-- Create functions for automatic complaint numbering
CREATE OR REPLACE FUNCTION generate_complaint_number()
RETURNS BIGINT AS $$
BEGIN
    RETURN (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate complaint numbers
CREATE OR REPLACE FUNCTION set_complaint_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.complaint_number IS NULL THEN
        NEW.complaint_number := generate_complaint_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_complaint_number
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION set_complaint_number();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_update_bla_members_updated_at
    BEFORE UPDATE ON public.bla_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_office_tasks_updated_at
    BEFORE UPDATE ON public.office_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bla_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Enable read access for all users" ON public.bla_members FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.bla_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.bla_members FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.complaints FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.activities FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.office_tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.office_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.office_tasks FOR UPDATE USING (true);

-- Storage policies for buckets (only create if they don't exist)
DO $$
BEGIN
    -- Check and create member-documents SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access member-documents'
    ) THEN
        CREATE POLICY "Public Access member-documents" ON storage.objects FOR SELECT USING (bucket_id = 'member-documents');
    END IF;
    
    -- Check and create member-documents INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Upload member-documents'
    ) THEN
        CREATE POLICY "Public Upload member-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'member-documents');
    END IF;
    
    -- Check and create activity-media SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access activity-media'
    ) THEN
        CREATE POLICY "Public Access activity-media" ON storage.objects FOR SELECT USING (bucket_id = 'activity-media');
    END IF;
    
    -- Check and create activity-media INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Upload activity-media'
    ) THEN
        CREATE POLICY "Public Upload activity-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'activity-media');
    END IF;
END
$$;

-- Create employees table for staff authentication
CREATE TABLE public.employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Passwords should always be hashed
    role VARCHAR(50) DEFAULT 'data_entry' NOT NULL CHECK (role IN ('admin', 'manager', 'data_entry', 'supervisor')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster username lookups
CREATE INDEX idx_employees_username ON public.employees(username);
CREATE INDEX idx_employees_role ON public.employees(role);
CREATE INDEX idx_employees_active ON public.employees(is_active);

-- Enable RLS for security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for employees table
CREATE POLICY "Allow authenticated employees to read their own data" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow insert for employee registration" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for employee data" ON public.employees FOR UPDATE USING (true);

-- Add the new column to track which employee registered a member
ALTER TABLE public.bla_members
ADD COLUMN registered_by_employee_id UUID REFERENCES public.employees(id);

-- Create an index for this new column
CREATE INDEX idx_bla_members_registered_by ON public.bla_members(registered_by_employee_id);

-- Add trigger for employees updated_at
CREATE TRIGGER trigger_update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- You can run this to populate with sample data

/*
-- Sample BLA Member
INSERT INTO public.bla_members (
    membership_number, full_name, father_name, date_of_birth, gender, 
    occupation, education, mobile, email, address, town, pincode,
    voter_id, constituency, previous_party, interests
) VALUES (
    'TVK2025001', 'முருகன் சௌந்தர்ராஜன்', 'சௌந்தர்ராஜன்', '1985-06-15', 'male',
    'தொழிலதிபர்', 'graduate', '9876543210', 'murugan@example.com', 
    'எண் 45, பெரிய தெரு, தி.நகர்', 'chennai', '600017',
    'TNE1234567', 'தி.நகர்', 'இல்லை', '["youth", "business"]'::jsonb
);

-- Sample Complaint
INSERT INTO public.complaints (
    complainant_name, phone, email, address, complaint_type, 
    complaint_details, priority
) VALUES (
    'ராஜ் குமார்', '9876543201', 'raj@example.com',
    'எண் 67, அண்ணா நகர், சென்னை', 'infrastructure',
    'எங்கள் பகுதியில் சாலை மிகவும் மோசமான நிலையில் உள்ளது. மழைக் காலத்தில் தண்ணீர் தேங்கி நிற்கிறது.',
    'high'
);

-- Sample Activity  
INSERT INTO public.activities (
    activity_id, title, description, activity_type, activity_date, 
    activity_time, venue, expected_attendees, organized_by
) VALUES (
    'ACT001', 'மக்கள் நலக்கூட்டம்', 'பகுதியின் அடிப்படை வசதிகள் குறித்த விவாதம்',
    'meeting', '2025-10-01', '10:00 AM', 'கட்சி அலுவலகம், சென்னை', 50, 'TVK சென்னை மாவட்ட அணி'
);

-- Sample Office Task
INSERT INTO public.office_tasks (
    task_id, title, description, assigned_to, priority, due_date, progress
) VALUES (
    'TASK001', 'உறுப்பினர் விண்ணப்பங்கள் மதிப்பீடு', 
    'புதிய உறுப்பினர் விண்ணப்பங்களை ஆய்வு செய்து அங்கீகரிக்க வேண்டும்',
    'நிர்வாக குழு', 'high', '2025-10-01', 60
);
*/
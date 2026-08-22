-- ==============================================================================
-- DAYFLOW HRMS - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'hr', 'admin')),
    department VARCHAR(100) NOT NULL DEFAULT 'General',
    designation VARCHAR(100) NOT NULL DEFAULT 'Staff Member',
    avatar_url TEXT,
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'away', 'offline', 'on-leave')),
    is_email_verified BOOLEAN NOT NULL DEFAULT true,
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ATTENDANCE & BIOMETRIC PUNCHES
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    working_hours VARCHAR(20) DEFAULT '--',
    duration_seconds INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Half-day', 'Leave')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 3. LEAVE BALANCES
CREATE TABLE IF NOT EXISTS public.leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL,
    annual_paid INTEGER NOT NULL DEFAULT 12,
    annual_total INTEGER NOT NULL DEFAULT 20,
    sick INTEGER NOT NULL DEFAULT 8,
    sick_total INTEGER NOT NULL DEFAULT 10,
    unpaid_taken INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('Paid', 'Sick', 'Unpaid', 'Annual', 'Medical')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days NUMERIC(4,1) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    hr_comment TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- 5. EMPLOYEES DIRECTORY & EXTENDED DOSSIERS
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    avatar_url TEXT,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (employment_status IN ('Active', 'On Leave', 'Inactive')),
    employment_type VARCHAR(50) NOT NULL DEFAULT 'Full-Time',
    work_location VARCHAR(100) DEFAULT 'HQ - San Francisco',
    manager VARCHAR(255) DEFAULT 'Alex Morgan',
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    basic_salary NUMERIC(12,2) NOT NULL DEFAULT 80000,
    allowances NUMERIC(12,2) NOT NULL DEFAULT 12000,
    deductions NUMERIC(12,2) NOT NULL DEFAULT 8000,
    net_salary NUMERIC(12,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
    currency VARCHAR(10) DEFAULT 'USD',
    pay_frequency VARCHAR(20) DEFAULT 'Monthly',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PAYROLL & COMPENSATION RECORDS
CREATE TABLE IF NOT EXISTS public.payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    month_year VARCHAR(20) NOT NULL,
    base_salary NUMERIC(12,2) NOT NULL,
    allowances NUMERIC(12,2) NOT NULL DEFAULT 0,
    deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
    gross_salary NUMERIC(12,2) NOT NULL,
    net_salary NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Processed' CHECK (status IN ('Processed', 'Pending', 'On Hold')),
    disbursement_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DOCUMENTS & COMPLIANCE ARCHIVE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('PDF', 'DOCX', 'PNG', 'ZIP')),
    file_url TEXT,
    size VARCHAR(50) NOT NULL DEFAULT '1.5 MB',
    category VARCHAR(100) NOT NULL DEFAULT 'Compliance',
    uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    uploaded_by UUID REFERENCES public.profiles(id)
);

-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if user is HR/Admin
CREATE OR REPLACE FUNCTION public.is_admin_or_hr()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'hr')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone authenticated can view; users can edit own profile, admins can edit all
CREATE POLICY "Profiles viewable by authenticated users"
    ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id OR public.is_admin_or_hr());

-- Attendance: Users can view & create their own attendance; HR/Admins can view & manage all
CREATE POLICY "Attendance viewable by owner or admin"
    ON public.attendance FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin_or_hr());

CREATE POLICY "Attendance insertable by owner or admin"
    ON public.attendance FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_admin_or_hr());

CREATE POLICY "Attendance updatable by owner or admin"
    ON public.attendance FOR UPDATE TO authenticated
    USING (user_id = auth.uid() OR public.is_admin_or_hr());

-- Leave Requests: Users see own requests; HR/Admin see and manage all
CREATE POLICY "Leave requests viewable by owner or admin"
    ON public.leave_requests FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin_or_hr());

CREATE POLICY "Leave requests insertable by authenticated users"
    ON public.leave_requests FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_admin_or_hr());

CREATE POLICY "Leave requests updatable by admin"
    ON public.leave_requests FOR UPDATE TO authenticated
    USING (public.is_admin_or_hr());

-- Employees Directory: Viewable by authenticated; updatable by HR/Admin
CREATE POLICY "Employees directory viewable by authenticated"
    ON public.employees FOR SELECT TO authenticated USING (true);

CREATE POLICY "Employees manageable by HR or Admin"
    ON public.employees FOR ALL TO authenticated
    USING (public.is_admin_or_hr());

-- Payroll: Viewable by employee for own record, all by HR/Admin
CREATE POLICY "Payroll viewable by owner or admin"
    ON public.payrolls FOR SELECT TO authenticated
    USING (
      public.is_admin_or_hr() OR
      employee_id IN (SELECT employee_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Payroll manageable by admin"
    ON public.payrolls FOR ALL TO authenticated
    USING (public.is_admin_or_hr());

-- Notifications: Viewable and updatable by target user or public
CREATE POLICY "Notifications viewable by owner"
    ON public.notifications FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR user_id IS NULL OR public.is_admin_or_hr());

CREATE POLICY "Notifications updatable by owner"
    ON public.notifications FOR UPDATE TO authenticated
    USING (user_id = auth.uid() OR public.is_admin_or_hr());

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role VARCHAR(50);
  assigned_emp_id VARCHAR(50);
  emp_count INT;
BEGIN
  -- Determine role based on user metadata or email
  assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'employee');
  
  -- Generate unique Employee ID
  SELECT COUNT(*) INTO emp_count FROM public.profiles;
  assigned_emp_id := 'DF-' || LPAD((1001 + emp_count)::TEXT, 4, '0');

  INSERT INTO public.profiles (id, employee_id, email, full_name, role, department, designation)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'employeeId', assigned_emp_id),
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    assigned_role,
    COALESCE(new.raw_user_meta_data->>'department', 'Engineering'),
    COALESCE(new.raw_user_meta_data->>'designation', 'Software Engineer')
  );

  -- Create initial leave balance record
  INSERT INTO public.leave_balances (user_id, employee_id, annual_paid, sick, unpaid_taken)
  VALUES (new.id, assigned_emp_id, 12, 8, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

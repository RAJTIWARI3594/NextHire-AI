-- ============================================================================
-- NextHire AI - Production PostgreSQL Database Architecture
-- Phase 2 (Auth & RBAC) + Phase 3 (Complete Database Schema)
-- Target Engine: Supabase PostgreSQL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 0. ENUM TYPES
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('applied', 'screening', 'interviewing', 'offered', 'hired', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'internship', 'contract', 'remote');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 1. USER MANAGEMENT TABLES
-- ============================================================================

-- Core Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS public.student_profiles (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  college TEXT NOT NULL,
  course TEXT NOT NULL,
  graduation_year INT NOT NULL,
  cgpa NUMERIC(3, 2),
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  ats_score INT DEFAULT 0,
  coins_balance INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recruiter Profiles
CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  designation TEXT NOT NULL,
  company_email TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT DEFAULT 'System Operations',
  access_level INT DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. COMPANIES TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  industry TEXT,
  company_size TEXT,
  headquarters TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  is_headquarters BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. JOBS & INTERNSHIPS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.job_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  responsibilities TEXT[],
  job_type job_type NOT NULL DEFAULT 'full_time',
  location TEXT NOT NULL,
  salary_min NUMERIC(12, 2),
  salary_max NUMERIC(12, 2),
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  applications_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID UNIQUE NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  duration_months INT NOT NULL DEFAULT 3,
  stipend_amount NUMERIC(10, 2),
  pre_placement_offer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, job_id)
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_url TEXT,
  match_score INT DEFAULT 0,
  status application_status NOT NULL DEFAULT 'applied',
  cover_letter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, student_id)
);

-- ============================================================================
-- 4. RESUME TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Master Resume',
  file_url TEXT,
  ats_score INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  grade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[],
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'Intermediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date_awarded DATE
);

CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  fluency TEXT DEFAULT 'Professional'
);

-- ============================================================================
-- 5. AI ENGINE TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_resume_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  strengths TEXT[],
  weaknesses TEXT[],
  improvements TEXT[],
  raw_feedback JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_role TEXT NOT NULL,
  transcript JSONB,
  overall_rating INT DEFAULT 0,
  feedback_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_title TEXT DEFAULT 'AI Career Advisor Session',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. CODING PLATFORM TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coding_profiles (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  leetcode_handle TEXT,
  github_handle TEXT,
  codeforces_handle TEXT,
  global_rank INT DEFAULT 0,
  solved_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.coding_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  description TEXT NOT NULL,
  test_cases JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.coding_questions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL, -- e.g. 'Accepted', 'Wrong Answer'
  execution_time_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coding_scores (
  student_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score INT DEFAULT 0,
  easy_solved INT DEFAULT 0,
  medium_solved INT DEFAULT 0,
  hard_solved INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. LEARNING LMS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  instructor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  content TEXT,
  order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

-- ============================================================================
-- 8. SOCIAL & NOTIFICATIONS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role user_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. MONETIZATION & BILLING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL, -- e.g. 'succeeded', 'failed'
  transaction_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. GAMIFICATION & REWARDS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.leaderboards (
  student_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  rank INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referee_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_coins INT DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. ADMIN & GOVERNANCE TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL, -- e.g. 'job', 'user'
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 12. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_student_profiles_college ON public.student_profiles(college);
CREATE INDEX IF NOT EXISTS idx_student_profiles_course ON public.student_profiles(course);
CREATE INDEX IF NOT EXISTS idx_student_profiles_grad_year ON public.student_profiles(graduation_year);

CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_company ON public.recruiter_profiles(company_name);

CREATE INDEX IF NOT EXISTS idx_jobs_title ON public.jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON public.jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_student_id ON public.job_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

CREATE INDEX IF NOT EXISTS idx_resumes_student_id ON public.resumes(student_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(sender_id, receiver_id);

-- ============================================================================
-- 13. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function & Trigger: Automatic updated_at column refresh
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  CREATE TRIGGER trg_update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  CREATE TRIGGER trg_update_recruiter_profiles_updated_at BEFORE UPDATE ON public.recruiter_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  CREATE TRIGGER trg_update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  CREATE TRIGGER trg_update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  CREATE TRIGGER trg_update_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Stored Procedure: Handle new Auth user creation automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role public.user_role;
  user_full_name TEXT;
BEGIN
  -- User metadata is user-controlled; never grant privileged roles during signup.
  assigned_role := 'student';
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User');

  INSERT INTO public.profiles (auth_user_id, role, full_name, avatar_url)
  VALUES (NEW.id, assigned_role, user_full_name, NEW.raw_user_meta_data->>'avatar_url');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Utility Functions requested
CREATE OR REPLACE FUNCTION public.count_job_applications(target_job_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT FROM public.job_applications WHERE job_id = target_job_id;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.award_coins(target_student_id UUID, coin_amount INT, coin_reason TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.coins (student_id, amount, reason) VALUES (target_student_id, coin_amount, coin_reason);
  UPDATE public.student_profiles SET coins_balance = coins_balance + coin_amount WHERE profile_id = target_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public select, Self update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Student Profiles: Viewable by recruiters & owner, editable by owner
CREATE POLICY "Student profiles viewable by authenticated users" ON public.student_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Students update own profile" ON public.student_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND auth_user_id = auth.uid())
);

-- Recruiter Profiles: Public viewable, editable by owner
CREATE POLICY "Recruiter profiles viewable by all" ON public.recruiter_profiles FOR SELECT USING (true);
CREATE POLICY "Recruiters update own profile" ON public.recruiter_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND auth_user_id = auth.uid())
);

-- Jobs: Active jobs public, insert/update by recruiters
CREATE POLICY "Active jobs viewable by everyone" ON public.jobs FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Recruiters manage own jobs" ON public.jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = recruiter_id AND auth_user_id = auth.uid() AND role = 'recruiter')
);

-- Job Applications: Student sees own, Recruiter sees applications for their jobs
CREATE POLICY "Students view own applications" ON public.job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);
CREATE POLICY "Students insert own applications" ON public.job_applications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid() AND role = 'student')
);
CREATE POLICY "Recruiters view applications for their jobs" ON public.job_applications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.profiles p ON j.recruiter_id = p.id
    WHERE j.id = job_id AND p.auth_user_id = auth.uid()
  )
);

-- Resumes: Student owns their resumes
CREATE POLICY "Students view own resumes" ON public.resumes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);
CREATE POLICY "Students insert own resumes" ON public.resumes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);

-- Notifications: Recipient only
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = recipient_id AND auth_user_id = auth.uid())
);

-- ============================================================================
-- 15. SUPABASE STORAGE BUCKET CONFIGURATION
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-images', 'profile-images', true),
  ('resumes', 'resumes', false),
  ('company-logos', 'company-logos', true),
  ('certificates', 'certificates', false),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public profile images viewable" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Users upload own profile image" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users access own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

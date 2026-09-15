-- ============================================================================
-- NextHire AI - Phase 7 Part 3 PostgreSQL Schema Expansion
-- Candidate Rankings, Interview Scheduling, Messaging, Offers, & Analytics
-- ============================================================================

-- 1. Candidate Rankings Table
CREATE TABLE IF NOT EXISTS public.candidate_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall_score INT NOT NULL DEFAULT 0, -- 0 to 100
  ats_score INT DEFAULT 0,
  skills_score INT DEFAULT 0,
  interview_score INT DEFAULT 0,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('Highly Recommended', 'Recommended', 'Consider', 'Not Recommended')),
  strengths TEXT[],
  weaknesses TEXT[],
  missing_skills TEXT[],
  is_shortlisted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, student_id)
);

-- 2. Interview Events Table
CREATE TABLE IF NOT EXISTS public.interview_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL DEFAULT 'Technical', -- HR, Technical, Coding, Managerial, Final
  scheduled_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 45,
  interviewer_name TEXT NOT NULL,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Recruiter Messages Table
CREATE TABLE IF NOT EXISTS public.recruiter_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('recruiter', 'student')),
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Offer Letters Table
CREATE TABLE IF NOT EXISTS public.offer_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  salary_package NUMERIC(12, 2) NOT NULL,
  joining_date DATE NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired')),
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_candidate_rankings_job ON public.candidate_rankings(job_id);
CREATE INDEX IF NOT EXISTS idx_interview_events_scheduled ON public.interview_events(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_recruiter_messages_chat ON public.recruiter_messages(recruiter_id, student_id);

-- RLS Policies
ALTER TABLE public.candidate_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters manage candidate rankings" ON public.candidate_rankings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'recruiter')
);

CREATE POLICY "Recruiters manage interview events" ON public.interview_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'recruiter')
);

CREATE POLICY "Recruiters manage offer letters" ON public.offer_letters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'recruiter')
);

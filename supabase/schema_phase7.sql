-- ============================================================================
-- NextHire AI - Phase 7 Part 1 PostgreSQL Schema Expansion
-- Jobs & Internship Portal, Application History, & AI Job Matching
-- ============================================================================

-- 1. Application Status History Table
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  status public.application_status NOT NULL,
  notes TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Job Matches Table
CREATE TABLE IF NOT EXISTS public.ai_job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score INT NOT NULL DEFAULT 0,
  missing_skills TEXT[],
  suggestions TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, job_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_status_history_app ON public.application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_ai_job_matches_student ON public.ai_job_matches(student_id);

-- RLS Policies
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view status history for their applications" ON public.application_status_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_applications a
    JOIN public.profiles p ON a.student_id = p.id
    WHERE a.id = application_id AND p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Students view own job matches" ON public.ai_job_matches FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);

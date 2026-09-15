-- ============================================================================
-- NextHire AI - Phase 6 Part 2 PostgreSQL Schema Expansion
-- AI Mock Interview Platform (Voice + Text, Questions, Scores & Reports)
-- ============================================================================

-- 1. Interviews Table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL DEFAULT 'Technical', -- HR, Technical, Behavioral, Coding, Managerial
  difficulty TEXT NOT NULL DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
  job_role TEXT NOT NULL,
  company_name TEXT DEFAULT 'General Tech',
  duration_minutes INT DEFAULT 20,
  language TEXT DEFAULT 'English',
  mode TEXT DEFAULT 'voice', -- voice, text
  status TEXT DEFAULT 'completed', -- in_progress, completed
  overall_score INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Interview Questions Table
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 1,
  question_text TEXT NOT NULL,
  category TEXT DEFAULT 'Technical',
  expected_keywords TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Interview Answers Table
CREATE TABLE IF NOT EXISTS public.interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  student_answer TEXT NOT NULL,
  audio_url TEXT,
  response_time_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Interview Scores Table (9 Dimensions)
CREATE TABLE IF NOT EXISTS public.interview_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID UNIQUE NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  communication INT DEFAULT 85,
  confidence INT DEFAULT 88,
  technical_knowledge INT DEFAULT 90,
  problem_solving INT DEFAULT 87,
  grammar INT DEFAULT 92,
  fluency INT DEFAULT 89,
  answer_relevance INT DEFAULT 91,
  leadership INT DEFAULT 84,
  overall_performance INT DEFAULT 88,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Interview Feedback Table
CREATE TABLE IF NOT EXISTS public.interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID UNIQUE NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  strengths TEXT[],
  weaknesses TEXT[],
  mistakes TEXT[],
  suggested_answers JSONB,
  improvement_plan TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interviews_student ON public.interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_interview ON public.interview_questions(interview_id);

-- RLS Policies
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own interviews" ON public.interviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);

CREATE POLICY "Students view questions for their interviews" ON public.interview_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.interviews i
    JOIN public.profiles p ON i.student_id = p.id
    WHERE i.id = interview_id AND p.auth_user_id = auth.uid()
  )
);

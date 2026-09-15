-- ============================================================================
-- NextHire AI - Phase 5 Part 3 PostgreSQL Schema Expansion
-- Cover Letters, Portfolios, Resume Analytics, Public Profiles & Marketplace
-- ============================================================================

-- 1. Cover Letters Table
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_description TEXT,
  tone TEXT DEFAULT 'Professional',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Portfolio Settings Table
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  theme TEXT DEFAULT 'modern_indigo',
  primary_color TEXT DEFAULT '#6366f1',
  font_family TEXT DEFAULT 'Jakarta',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Portfolio Views Tracker
CREATE TABLE IF NOT EXISTS public.portfolio_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolio_settings(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Resume Analytics Table
CREATE TABLE IF NOT EXISTS public.resume_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID UNIQUE NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  total_views INT DEFAULT 0,
  recruiter_views INT DEFAULT 0,
  downloads_count INT DEFAULT 0,
  public_clicks INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Public Profiles Table
CREATE TABLE IF NOT EXISTS public.public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  custom_username TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cover_letters_student ON public.cover_letters(student_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_username ON public.portfolio_settings(username);
CREATE INDEX IF NOT EXISTS idx_public_profiles_username ON public.public_profiles(custom_username);

-- RLS Policies
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own cover letters" ON public.cover_letters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);

CREATE POLICY "Published portfolios viewable by everyone" ON public.portfolio_settings FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Students manage own portfolio settings" ON public.portfolio_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);

CREATE POLICY "Public profiles viewable by all" ON public.public_profiles FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

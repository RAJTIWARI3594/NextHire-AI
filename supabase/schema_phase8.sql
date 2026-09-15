-- ============================================================================
-- NextHire AI - Phase 8 Part 1 PostgreSQL Schema Expansion
-- Admin Dashboard, User Management, Recruiter Approvals, & Audit Logs
-- ============================================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_level TEXT NOT NULL DEFAULT 'super_admin' CHECK (role_level IN ('super_admin', 'moderator', 'support')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Admin Activity Logs Table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- user_suspended, recruiter_approved, job_rejected, etc.
  target_resource TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Platform Statistics Snapshot Table
CREATE TABLE IF NOT EXISTS public.platform_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_students INT DEFAULT 0,
  total_recruiters INT DEFAULT 0,
  total_companies INT DEFAULT 0,
  total_jobs INT DEFAULT 0,
  total_applications INT DEFAULT 0,
  daily_ai_requests INT DEFAULT 0,
  monthly_revenue_usd NUMERIC(12, 2) DEFAULT 0,
  server_health TEXT DEFAULT 'healthy',
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON public.admin_activity_logs(action_type);

-- RLS Policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins access all admin users" ON public.admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Super Admins access all activity logs" ON public.admin_activity_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Super Admins access platform stats" ON public.platform_statistics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

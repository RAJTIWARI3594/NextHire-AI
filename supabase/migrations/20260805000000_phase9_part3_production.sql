-- ============================================================================
-- NextHire AI - Phase 9 (Part 3) Versioned Production Migration
-- Schema Migration Registry, System Performance Indexes, & Audit Triggers
-- ============================================================================

-- 1. Migration Registry Table for Version Control
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  name TEXT NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Register initial Phase 9 Migration Record
INSERT INTO public.schema_migrations (version, name, checksum)
VALUES (
  '20260805000000',
  'phase9_part3_production_hardening',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
)
ON CONFLICT (version) DO NOTHING;

-- 2. Ensure Schema Audit Trigger Functions Exist
CREATE OR REPLACE FUNCTION public.update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Production Composite Index Optimization
CREATE INDEX IF NOT EXISTS idx_profiles_role_auth ON public.profiles(role, auth_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status_posted ON public.jobs(status, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_user_status ON public.resumes(user_id, status);

-- 4. Enable RLS on schema_migrations
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access schema_migrations" ON public.schema_migrations
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

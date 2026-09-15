-- ============================================================================
-- NextHire AI - Phase 8 Part 3 PostgreSQL Schema Expansion
-- System Administration, DevOps, Security, Feature Flags, & Monitoring
-- ============================================================================

-- 1. Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL DEFAULT 'NextHire AI',
  contact_email TEXT DEFAULT 'contact@nexthire.ai',
  support_email TEXT DEFAULT 'support@nexthire.ai',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  default_theme TEXT DEFAULT 'dark',
  default_language TEXT DEFAULT 'English',
  default_currency TEXT DEFAULT 'USD',
  terms_url TEXT DEFAULT '/terms',
  privacy_url TEXT DEFAULT '/privacy',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Feature Flags Table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- ai_chat, ai_interview, resume_builder, etc.
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  rollout_percentage INT DEFAULT 100,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Security Events Table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- failed_login, ip_blocked, rate_limit_exceeded, etc.
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. API Keys Table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- gemini, openai, stripe, razorpay, resend
  key_name TEXT NOT NULL,
  masked_key TEXT NOT NULL,
  last_used TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Backup History Table
CREATE TABLE IF NOT EXISTS public.backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_name TEXT NOT NULL,
  size_mb NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'in_progress')),
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Integrations Table
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT UNIQUE NOT NULL, -- google_oauth, github_oauth, razorpay, stripe, gemini, resend
  name TEXT NOT NULL,
  is_connected BOOLEAN DEFAULT TRUE,
  health_status TEXT DEFAULT 'operational',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_backup_history_date ON public.backup_history(created_at);

-- RLS Policies
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins manage devops tables" ON public.platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone view active feature flags" ON public.feature_flags FOR SELECT USING (is_enabled = true OR auth.role() = 'authenticated');

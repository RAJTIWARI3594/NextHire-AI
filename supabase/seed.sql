-- ============================================================================
-- NextHire AI - Phase 9 Production Seed Data
-- ============================================================================

-- 1. Initial Platform Settings
INSERT INTO public.platform_settings (
  platform_name,
  contact_email,
  support_email,
  maintenance_mode,
  default_theme,
  default_language,
  default_currency
) VALUES (
  'NextHire AI',
  'contact@nexthire.ai',
  'support@nexthire.ai',
  FALSE,
  'dark',
  'English',
  'USD'
) ON CONFLICT DO NOTHING;

-- 2. Core Feature Flags
INSERT INTO public.feature_flags (key, name, description, is_enabled, rollout_percentage) VALUES
  ('ai_chat', 'AI Resume & Career Assistant', 'Interactive AI chat assistant powered by Gemini 1.5 Flash', TRUE, 100),
  ('ai_interview', 'AI Video Interview Assessor', 'Automated mock video interview evaluation and feedback', TRUE, 100),
  ('resume_builder', 'ATS Resume Builder & Score', 'Interactive ATS resume optimization and scoring engine', TRUE, 100),
  ('coding_platform', 'Coding Assessment Sandbox', 'Live browser coding challenge environment with test runner', TRUE, 100),
  ('recruiter_portal', 'Recruiter Portal & Candidate Search', 'Corporate recruiter candidate search and job posting portal', TRUE, 100),
  ('security_shield', 'Captcha & Bot Protection Shield', 'Turnstile challenge and rate-limiting bot protection', TRUE, 100)
ON CONFLICT (key) DO UPDATE SET is_enabled = EXCLUDED.is_enabled;

-- 3. System Integrations Operational Status
INSERT INTO public.integrations (provider, name, is_connected, health_status) VALUES
  ('google_oauth', 'Google Single Sign-On', TRUE, 'operational'),
  ('github_oauth', 'GitHub Developer Auth', TRUE, 'operational'),
  ('stripe', 'Stripe Global Payment Gateway', TRUE, 'operational'),
  ('razorpay', 'Razorpay Payment Integration', TRUE, 'operational'),
  ('gemini', 'Google Gemini 1.5 Flash AI Engine', TRUE, 'operational'),
  ('resend', 'Resend Transactional Email Engine', TRUE, 'operational')
ON CONFLICT (provider) DO UPDATE SET health_status = EXCLUDED.health_status;

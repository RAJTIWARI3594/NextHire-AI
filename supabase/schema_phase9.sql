-- ============================================================================
-- NextHire AI - Phase 9 (Part 2) Production Hardening PostgreSQL Schema
-- Security, Telemetry, Monitoring, Alerting, Rate Limiting & Background Jobs
-- ============================================================================

-- 1. Security Events & Threat Audit Table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- failed_login, brute_force_attempt, ip_blocked, anomaly_detected, csrf_mismatch, rate_limit_exceeded
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT,
  user_agent TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. API Rate Limiting Tracker Table
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- e.g. "ip:192.168.1.1:login" or "user:uuid:ai"
  tokens INT NOT NULL DEFAULT 100,
  max_tokens INT NOT NULL DEFAULT 100,
  last_refill TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Monitoring & Telemetry Events Table
CREATE TABLE IF NOT EXISTS public.monitoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL, -- api_latency, db_query_time, ai_response_time, error_rate, active_users, memory_usage
  metric_value NUMERIC(12, 4) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'ms', -- ms, %, count, bytes
  tags JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. System Alerts Table
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('server', 'cpu', 'memory', 'database', 'payment', 'ai_provider', 'error_spike')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 5. Enterprise Background Job Queue Table
CREATE TABLE IF NOT EXISTS public.background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL CHECK (queue_name IN ('email', 'notification', 'ai_task', 'report_generation', 'cleanup')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  error_message TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Performance Logs Table
CREATE TABLE IF NOT EXISTS public.performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route TEXT NOT NULL,
  latency_ms INT NOT NULL,
  status_code INT NOT NULL,
  db_query_time_ms INT DEFAULT 0,
  ai_latency_ms INT DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Device Sessions Management Table
CREATE TABLE IF NOT EXISTS public.device_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  browser TEXT,
  ip_address TEXT NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PRODUCTION QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_security_events_type_created ON public.security_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON public.security_events(ip_address);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_key ON public.api_rate_limits(key);

CREATE INDEX IF NOT EXISTS idx_monitoring_events_metric_time ON public.monitoring_events(metric_name, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_system_alerts_status_severity ON public.system_alerts(status, severity);

CREATE INDEX IF NOT EXISTS idx_background_jobs_queue_status ON public.background_jobs(queue_name, status, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_performance_logs_route_time ON public.performance_logs(route, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_device_sessions_user_active ON public.device_sessions(user_id, expires_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Admins manage security, monitoring, alerts, background jobs & telemetry
CREATE POLICY "Admins full access security_events" ON public.security_events
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins full access monitoring_events" ON public.monitoring_events
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins full access system_alerts" ON public.system_alerts
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins full access background_jobs" ON public.background_jobs
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins full access performance_logs" ON public.performance_logs
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Users manage their own device sessions
CREATE POLICY "Users access own device_sessions" ON public.device_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RETENTION & MAINTENANCE PROCEDURES
-- ============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_old_telemetry(days_to_keep INT DEFAULT 30)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.monitoring_events WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL;
  DELETE FROM public.performance_logs WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL;
  DELETE FROM public.security_events WHERE created_at < NOW() - (days_to_keep * 2 || ' days')::INTERVAL AND severity IN ('low', 'medium');
  DELETE FROM public.background_jobs WHERE status = 'completed' AND processed_at < NOW() - (days_to_keep || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

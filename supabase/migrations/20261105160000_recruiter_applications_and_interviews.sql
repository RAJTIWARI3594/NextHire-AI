CREATE TABLE IF NOT EXISTS public.candidate_shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  recruiter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT candidate_shortlists_application_recruiter_unique UNIQUE (application_id, recruiter_id)
);

ALTER TABLE public.candidate_shortlists ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.candidate_shortlists TO authenticated, service_role;

DROP POLICY IF EXISTS "Verified recruiter manages own shortlists" ON public.candidate_shortlists;
CREATE POLICY "Verified recruiter manages own shortlists"
ON public.candidate_shortlists FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    JOIN public.jobs job ON job.recruiter_id = recruiter.id
    JOIN public.job_applications application ON application.job_id = job.id
    WHERE recruiter.id = candidate_shortlists.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND application.id = candidate_shortlists.application_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    JOIN public.jobs job ON job.recruiter_id = recruiter.id
    JOIN public.job_applications application ON application.job_id = job.id
    WHERE recruiter.id = candidate_shortlists.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND application.id = candidate_shortlists.application_id
  )
);

CREATE INDEX IF NOT EXISTS idx_candidate_shortlists_recruiter ON public.candidate_shortlists(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_candidate_shortlists_application ON public.candidate_shortlists(application_id);

CREATE TABLE IF NOT EXISTS public.interview_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interview_type text NOT NULL CHECK (interview_type IN ('HR','Technical','Coding','Managerial','Final Round')),
  scheduled_time timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 45 CHECK (duration_minutes BETWEEN 15 AND 240),
  interviewer_name text NOT NULL CHECK (length(trim(interviewer_name)) BETWEEN 2 AND 120),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','rescheduled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.interview_events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_events TO authenticated, service_role;
CREATE INDEX IF NOT EXISTS idx_interview_events_recruiter_time ON public.interview_events(recruiter_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_interview_events_student_time ON public.interview_events(student_id, scheduled_time);

DROP POLICY IF EXISTS "Interview participants read events" ON public.interview_events;
CREATE POLICY "Interview participants read events"
ON public.interview_events FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles student
    WHERE student.id = interview_events.student_id
      AND student.auth_user_id = (SELECT auth.uid())
  )
  OR EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    WHERE recruiter.id = interview_events.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND EXISTS (
        SELECT 1 FROM public.jobs job
        JOIN public.job_applications application ON application.job_id = job.id
        WHERE job.id = interview_events.job_id
          AND job.recruiter_id = recruiter.id
          AND application.student_id = interview_events.student_id
      )
  )
);

DROP POLICY IF EXISTS "Verified recruiters schedule interviews for applicants" ON public.interview_events;
CREATE POLICY "Verified recruiters schedule interviews for applicants"
ON public.interview_events FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    JOIN public.jobs job ON job.recruiter_id = recruiter.id
    JOIN public.job_applications application ON application.job_id = job.id AND application.student_id = interview_events.student_id
    WHERE recruiter.id = interview_events.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND job.id = interview_events.job_id
  )
);

DROP POLICY IF EXISTS "Verified recruiters update own interviews" ON public.interview_events;
CREATE POLICY "Verified recruiters update own interviews"
ON public.interview_events FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    JOIN public.jobs job ON job.recruiter_id = recruiter.id
    JOIN public.job_applications application ON application.job_id = job.id AND application.student_id = interview_events.student_id
    WHERE recruiter.id = interview_events.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND job.id = interview_events.job_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    JOIN public.jobs job ON job.recruiter_id = recruiter.id
    JOIN public.job_applications application ON application.job_id = job.id AND application.student_id = interview_events.student_id
    WHERE recruiter.id = interview_events.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND job.id = interview_events.job_id
  )
);

DROP POLICY IF EXISTS "Verified recruiters delete own interviews" ON public.interview_events;
CREATE POLICY "Verified recruiters delete own interviews"
ON public.interview_events FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    WHERE recruiter.id = interview_events.recruiter_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
  )
);

CREATE OR REPLACE VIEW public.verified_recruiter_candidate_applications
WITH (security_barrier = true)
AS
SELECT
  application.id AS application_id,
  application.job_id,
  application.student_id,
  student.full_name AS student_name,
  student.avatar_url AS student_avatar,
  auth_user.email AS student_email,
  job.title AS job_title,
  COALESCE(application.match_score, 0) AS match_score,
  COALESCE(student_details.ats_score, 0) AS ats_score,
  application.status::text AS application_status,
  application.created_at AS applied_at,
  student_details.college,
  student_details.course,
  student_details.graduation_year,
  EXISTS (
    SELECT 1 FROM public.candidate_shortlists shortlist
    WHERE shortlist.application_id = application.id AND shortlist.recruiter_id = recruiter.id
  ) AS is_shortlisted
FROM public.job_applications application
JOIN public.jobs job ON job.id = application.job_id
JOIN public.profiles student ON student.id = application.student_id
JOIN auth.users auth_user ON auth_user.id = student.auth_user_id
LEFT JOIN public.student_profiles student_details ON student_details.profile_id = student.id
JOIN public.profiles recruiter ON recruiter.auth_user_id = (SELECT auth.uid())
JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
WHERE recruiter.role = 'recruiter'::public.user_role
  AND recruiter_details.is_verified IS TRUE
  AND job.recruiter_id = recruiter.id
  AND student.role = 'student'::public.user_role;

REVOKE ALL ON public.verified_recruiter_candidate_applications FROM PUBLIC, anon;
GRANT SELECT ON public.verified_recruiter_candidate_applications TO authenticated;

CREATE OR REPLACE VIEW public.verified_recruiter_interviews
WITH (security_barrier = true)
AS
SELECT
  interview.id,
  interview.job_id,
  interview.student_id,
  interview.recruiter_id,
  interview.interview_type,
  interview.scheduled_time,
  interview.duration_minutes,
  interview.interviewer_name,
  interview.status,
  interview.created_at,
  student.full_name AS candidate_name,
  job.title AS job_title
FROM public.interview_events interview
JOIN public.jobs job ON job.id = interview.job_id
JOIN public.profiles student ON student.id = interview.student_id
JOIN public.profiles recruiter ON recruiter.id = interview.recruiter_id
JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
WHERE recruiter.auth_user_id = (SELECT auth.uid())
  AND recruiter.role = 'recruiter'::public.user_role
  AND recruiter_details.is_verified IS TRUE
  AND job.recruiter_id = recruiter.id;

REVOKE ALL ON public.verified_recruiter_interviews FROM PUBLIC, anon;
GRANT SELECT ON public.verified_recruiter_interviews TO authenticated;

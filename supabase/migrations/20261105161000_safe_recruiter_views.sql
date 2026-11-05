CREATE TABLE IF NOT EXISTS public.candidate_public_profiles (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.candidate_public_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.candidate_public_profiles FROM PUBLIC, anon;
GRANT SELECT ON public.candidate_public_profiles TO authenticated, service_role;

DROP POLICY IF EXISTS "Candidate public profile owner or verified recruiter read" ON public.candidate_public_profiles;
CREATE POLICY "Candidate public profile owner or verified recruiter read"
ON public.candidate_public_profiles FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles owner_profile
    WHERE owner_profile.id = candidate_public_profiles.profile_id
      AND owner_profile.auth_user_id = (SELECT auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles recruiter
    JOIN public.recruiter_profiles recruiter_details ON recruiter_details.profile_id = recruiter.id
    JOIN public.jobs job ON job.recruiter_id = recruiter.id
    JOIN public.job_applications application ON application.job_id = job.id
    WHERE recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
      AND application.student_id = candidate_public_profiles.profile_id
  )
);

CREATE OR REPLACE FUNCTION public.sync_candidate_public_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role = 'student'::public.user_role THEN
    INSERT INTO public.candidate_public_profiles(profile_id, display_name, avatar_url, updated_at)
    VALUES (NEW.id, COALESCE(NULLIF(trim(NEW.full_name), ''), 'Student'), NEW.avatar_url, now())
    ON CONFLICT (profile_id) DO UPDATE
      SET display_name = EXCLUDED.display_name,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = now();
  ELSE
    DELETE FROM public.candidate_public_profiles WHERE profile_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_candidate_public_profile() FROM PUBLIC, anon, authenticated, service_role;
DROP TRIGGER IF EXISTS trg_sync_candidate_public_profile ON public.profiles;
CREATE TRIGGER trg_sync_candidate_public_profile
AFTER INSERT OR UPDATE OF role, full_name, avatar_url ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_candidate_public_profile();

INSERT INTO public.candidate_public_profiles(profile_id, display_name, avatar_url)
SELECT p.id, COALESCE(NULLIF(trim(p.full_name), ''), 'Student'), p.avatar_url
FROM public.profiles p
WHERE p.role = 'student'::public.user_role
ON CONFLICT (profile_id) DO UPDATE
  SET display_name = EXCLUDED.display_name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = now();

DROP POLICY IF EXISTS "Student profile owner or recruiter read" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profile owner read" ON public.student_profiles;
CREATE POLICY "Student profile owner read"
ON public.student_profiles FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles owner_profile
    WHERE owner_profile.id = student_profiles.profile_id
      AND owner_profile.auth_user_id = (SELECT auth.uid())
  )
);

CREATE VIEW public.verified_recruiter_candidate_applications
WITH (security_invoker = true, security_barrier = true)
AS
SELECT
  application.id AS application_id,
  application.job_id,
  application.student_id,
  candidate.display_name AS student_name,
  candidate.avatar_url AS student_avatar,
  job.title AS job_title,
  COALESCE(application.match_score, 0) AS match_score,
  application.status::text AS application_status,
  application.created_at AS applied_at,
  EXISTS (
    SELECT 1 FROM public.candidate_shortlists shortlist
    WHERE shortlist.application_id = application.id
      AND shortlist.recruiter_id = job.recruiter_id
  ) AS is_shortlisted
FROM public.job_applications application
JOIN public.jobs job ON job.id = application.job_id
JOIN public.candidate_public_profiles candidate ON candidate.profile_id = application.student_id
WHERE job.recruiter_id = (
  SELECT recruiter.id FROM public.profiles recruiter
  WHERE recruiter.auth_user_id = (SELECT auth.uid())
    AND recruiter.role = 'recruiter'::public.user_role
)
AND EXISTS (
  SELECT 1 FROM public.recruiter_profiles recruiter_details
  WHERE recruiter_details.profile_id = job.recruiter_id
    AND recruiter_details.is_verified IS TRUE
);
REVOKE ALL ON public.verified_recruiter_candidate_applications FROM PUBLIC, anon;
GRANT SELECT ON public.verified_recruiter_candidate_applications TO authenticated;

CREATE VIEW public.verified_recruiter_interviews
WITH (security_invoker = true, security_barrier = true)
AS
SELECT
  interview.id, interview.job_id, interview.student_id, interview.recruiter_id,
  interview.interview_type, interview.scheduled_time, interview.duration_minutes,
  interview.interviewer_name, interview.status, interview.created_at,
  candidate.display_name AS candidate_name, job.title AS job_title
FROM public.interview_events interview
JOIN public.jobs job ON job.id = interview.job_id
JOIN public.candidate_public_profiles candidate ON candidate.profile_id = interview.student_id
WHERE interview.recruiter_id = (
  SELECT recruiter.id FROM public.profiles recruiter
  WHERE recruiter.auth_user_id = (SELECT auth.uid())
    AND recruiter.role = 'recruiter'::public.user_role
)
AND job.recruiter_id = interview.recruiter_id
AND EXISTS (
  SELECT 1 FROM public.recruiter_profiles recruiter_details
  WHERE recruiter_details.profile_id = interview.recruiter_id
    AND recruiter_details.is_verified IS TRUE
);
REVOKE ALL ON public.verified_recruiter_interviews FROM PUBLIC, anon;
GRANT SELECT ON public.verified_recruiter_interviews TO authenticated;

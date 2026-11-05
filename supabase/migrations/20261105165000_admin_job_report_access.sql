
DROP POLICY IF EXISTS "Recruiter updates own jobs" ON public.jobs;
CREATE POLICY "Recruiter or admin updates jobs"
ON public.jobs
FOR UPDATE TO authenticated
USING (
  (SELECT private.is_current_user_admin())
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.recruiter_profiles rp ON rp.profile_id = p.id
    WHERE p.id = jobs.recruiter_id
      AND p.auth_user_id = (SELECT auth.uid())
      AND p.role = 'recruiter'::public.user_role
      AND rp.is_verified IS TRUE
  )
)
WITH CHECK (
  (SELECT private.is_current_user_admin())
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.recruiter_profiles rp ON rp.profile_id = p.id
    WHERE p.id = jobs.recruiter_id
      AND p.auth_user_id = (SELECT auth.uid())
      AND p.role = 'recruiter'::public.user_role
      AND rp.is_verified IS TRUE
  )
);

DROP POLICY IF EXISTS "Own reports all" ON public.reports;
DROP POLICY IF EXISTS "Own reports read" ON public.reports;
DROP POLICY IF EXISTS "Own reports insert" ON public.reports;
DROP POLICY IF EXISTS "Own reports update" ON public.reports;
DROP POLICY IF EXISTS "Own reports delete" ON public.reports;

CREATE POLICY "Own reports or admin read"
ON public.reports
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = reports.reporter_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
  OR (SELECT private.is_current_user_admin())
);

CREATE POLICY "Own reports insert"
ON public.reports
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = reports.reporter_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Own reports update"
ON public.reports
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = reports.reporter_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = reports.reporter_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Own reports delete"
ON public.reports
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = reports.reporter_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
);

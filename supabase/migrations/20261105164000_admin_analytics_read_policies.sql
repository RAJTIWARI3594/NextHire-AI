
DROP POLICY IF EXISTS "Active jobs or owner recruiter read" ON public.jobs;
CREATE POLICY "Active jobs or owner recruiter read"
ON public.jobs
FOR SELECT
TO public
USING (
  is_active IS TRUE
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = jobs.recruiter_id
      AND p.auth_user_id = (SELECT auth.uid())
      AND p.role = 'recruiter'::public.user_role
  )
  OR (SELECT private.is_current_user_admin())
);

DROP POLICY IF EXISTS "Users view own or managed job applications" ON public.job_applications;
CREATE POLICY "Users view own or managed job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles student
    WHERE student.id = job_applications.student_id
      AND student.auth_user_id = (SELECT auth.uid())
  )
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    JOIN public.profiles recruiter ON recruiter.id = j.recruiter_id
    JOIN public.recruiter_profiles recruiter_details
      ON recruiter_details.profile_id = recruiter.id
    WHERE j.id = job_applications.job_id
      AND recruiter.auth_user_id = (SELECT auth.uid())
      AND recruiter.role = 'recruiter'::public.user_role
      AND recruiter_details.is_verified IS TRUE
  )
  OR (SELECT private.is_current_user_admin())
);

DROP POLICY IF EXISTS "Payments owner read" ON public.payments;
CREATE POLICY "Payments owner or admin read"
ON public.payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = payments.profile_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
  OR (SELECT private.is_current_user_admin())
);

DROP POLICY IF EXISTS "owner_all_ai_chat_history" ON public.ai_chat_history;
DROP POLICY IF EXISTS "AI chat owner or admin read" ON public.ai_chat_history;
DROP POLICY IF EXISTS "AI chat owner insert" ON public.ai_chat_history;
DROP POLICY IF EXISTS "AI chat owner update" ON public.ai_chat_history;
DROP POLICY IF EXISTS "AI chat owner delete" ON public.ai_chat_history;

CREATE POLICY "AI chat owner or admin read"
ON public.ai_chat_history
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = ai_chat_history.student_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
  OR (SELECT private.is_current_user_admin())
);

CREATE POLICY "AI chat owner insert"
ON public.ai_chat_history
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = ai_chat_history.student_id
      AND p.auth_user_id = (SELECT auth.uid())
      AND p.role = 'student'::public.user_role
  )
);

CREATE POLICY "AI chat owner update"
ON public.ai_chat_history
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = ai_chat_history.student_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = ai_chat_history.student_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "AI chat owner delete"
ON public.ai_chat_history
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = ai_chat_history.student_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
);

-- Applied to Supabase project molfpghzccbssmjfktac.
-- Allows recruiter self-registration without allowing self-assigned admin roles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE assigned_role public.user_role; user_full_name TEXT;
BEGIN
  assigned_role := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'recruiter' THEN 'recruiter'::public.user_role
    ELSE 'student'::public.user_role
  END;
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User');
  INSERT INTO public.profiles (auth_user_id, role, full_name, avatar_url)
  VALUES (NEW.id, assigned_role, user_full_name, NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_profile_role_changes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN RETURN NEW; END IF;
    IF NOT EXISTS (SELECT 1 FROM public.profiles actor WHERE actor.auth_user_id=auth.uid() AND actor.role='admin') THEN
      RAISE EXCEPTION 'Only an administrator may change account roles' USING ERRCODE='42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS guard_profile_role_changes ON public.profiles;
CREATE TRIGGER guard_profile_role_changes BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_profile_role_changes();

DROP POLICY IF EXISTS "Students insert own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Students view own resumes" ON public.resumes;
CREATE POLICY "Students insert own resumes" ON public.resumes FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid() AND p.role='student'));
CREATE POLICY "Students view own resumes" ON public.resumes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid()));
CREATE POLICY "Students update own resumes" ON public.resumes FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid() AND p.role='student'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid() AND p.role='student'));
CREATE POLICY "Students delete own resumes" ON public.resumes FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid() AND p.role='student'));

DROP POLICY IF EXISTS "Recruiters view applications for their jobs" ON public.job_applications;
DROP POLICY IF EXISTS "Students insert own applications" ON public.job_applications;
DROP POLICY IF EXISTS "Students view own applications" ON public.job_applications;
CREATE POLICY "Recruiters view applications for their jobs" ON public.job_applications FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.jobs j JOIN public.profiles p ON p.id=j.recruiter_id WHERE j.id=job_applications.job_id AND p.auth_user_id=auth.uid() AND p.role='recruiter'));
CREATE POLICY "Students insert own applications" ON public.job_applications FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid() AND p.role='student'));
CREATE POLICY "Students view own applications" ON public.job_applications FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.auth_user_id=auth.uid()));

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=recipient_id AND p.auth_user_id=auth.uid()));
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=recipient_id AND p.auth_user_id=auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=recipient_id AND p.auth_user_id=auth.uid()));

CREATE POLICY "Student creates own student profile" ON public.student_profiles FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=profile_id AND p.auth_user_id=auth.uid() AND p.role='student'));
CREATE POLICY "Recruiter creates own recruiter profile" ON public.recruiter_profiles FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=profile_id AND p.auth_user_id=auth.uid() AND p.role='recruiter'));

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_profile_role_changes() FROM PUBLIC, anon, authenticated;

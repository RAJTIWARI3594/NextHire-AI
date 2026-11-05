
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_suspended boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.guard_profile_suspension_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, pg_temp
AS $$
BEGIN
  IF NEW.is_suspended IS DISTINCT FROM OLD.is_suspended THEN
    IF session_user IN ('postgres', 'supabase_admin')
       OR current_setting('request.jwt.claim.role', true) = 'service_role' THEN
      RETURN NEW;
    END IF;

    IF private.is_current_user_admin() THEN
      IF NEW.id = (
        SELECT actor.id FROM public.profiles actor
        WHERE actor.auth_user_id = (SELECT auth.uid())
      ) THEN
        RAISE EXCEPTION 'Administrators cannot suspend their own account'
          USING ERRCODE = '42501';
      END IF;
      RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Only an administrator may suspend or reactivate accounts'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_profile_suspension_changes() FROM PUBLIC, anon, authenticated, service_role;
DROP TRIGGER IF EXISTS trg_guard_profile_suspension_changes ON public.profiles;
CREATE TRIGGER trg_guard_profile_suspension_changes
BEFORE UPDATE OF is_suspended ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_profile_suspension_changes();

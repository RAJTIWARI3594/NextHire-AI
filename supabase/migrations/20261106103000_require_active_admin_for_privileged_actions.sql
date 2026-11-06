-- Restrict all database-level administrator privileges to active admin accounts.
-- This applies to existing RLS policies and trigger guards using the helper.

CREATE OR REPLACE FUNCTION private.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.auth_user_id = (SELECT auth.uid())
      AND p.role = 'admin'::public.user_role
      AND COALESCE(p.is_suspended, false) = false
  );
$function$;

CREATE OR REPLACE FUNCTION public.guard_profile_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF session_user IN ('postgres', 'supabase_admin')
       OR current_setting('request.jwt.claim.role', true) = 'service_role' THEN
      RETURN NEW;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.profiles actor
      WHERE actor.auth_user_id = (SELECT auth.uid())
        AND actor.role = 'admin'::public.user_role
        AND COALESCE(actor.is_suspended, false) = false
    ) THEN
      RAISE EXCEPTION 'Only an active administrator may change account roles'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

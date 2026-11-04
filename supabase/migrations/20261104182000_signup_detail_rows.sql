CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE assigned_role public.user_role; user_full_name TEXT; graduation_year_value INT;
BEGIN
  assigned_role := CASE WHEN NEW.raw_user_meta_data->>'role'='recruiter' THEN 'recruiter'::public.user_role ELSE 'student'::public.user_role END;
  user_full_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name',''),'New User');
  INSERT INTO public.profiles(auth_user_id,role,full_name,avatar_url) VALUES(NEW.id,assigned_role,user_full_name,NEW.raw_user_meta_data->>'avatar_url');
  IF assigned_role='student' THEN
    IF COALESCE(NEW.raw_user_meta_data->>'graduationYear','') ~ '^[0-9]{4}$' THEN graduation_year_value := (NEW.raw_user_meta_data->>'graduationYear')::INT;
    ELSE graduation_year_value := EXTRACT(YEAR FROM CURRENT_DATE)::INT; END IF;
    INSERT INTO public.student_profiles(profile_id,college,course,graduation_year)
    SELECT id,COALESCE(NULLIF(NEW.raw_user_meta_data->>'college',''),'Not provided'),COALESCE(NULLIF(NEW.raw_user_meta_data->>'course',''),'Not provided'),graduation_year_value
    FROM public.profiles WHERE auth_user_id=NEW.id;
  ELSE
    INSERT INTO public.recruiter_profiles(profile_id,company_name,website,designation,company_email)
    SELECT id,COALESCE(NULLIF(NEW.raw_user_meta_data->>'company_name',''),'Company pending verification'),NULLIF(NEW.raw_user_meta_data->>'company_website',''),COALESCE(NULLIF(NEW.raw_user_meta_data->>'designation',''),'Recruiter'),COALESCE(NULLIF(NEW.raw_user_meta_data->>'company_email',''),NEW.email)
    FROM public.profiles WHERE auth_user_id=NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

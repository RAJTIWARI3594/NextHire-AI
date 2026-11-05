
DROP POLICY IF EXISTS "Public read announcements" ON public.announcements;
CREATE POLICY "Public read announcements"
ON public.announcements FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins insert announcements"
ON public.announcements FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_current_user_admin()));

CREATE POLICY "Admins update announcements"
ON public.announcements FOR UPDATE TO authenticated
USING ((SELECT private.is_current_user_admin()))
WITH CHECK ((SELECT private.is_current_user_admin()));

CREATE POLICY "Admins delete announcements"
ON public.announcements FOR DELETE TO authenticated
USING ((SELECT private.is_current_user_admin()));

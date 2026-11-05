
DROP POLICY IF EXISTS "Subscriptions owner read" ON public.subscriptions;
CREATE POLICY "Subscriptions owner or admin read"
ON public.subscriptions
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = subscriptions.profile_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
  OR (SELECT private.is_current_user_admin())
);

DROP POLICY IF EXISTS "Invoices owner read" ON public.invoices;
CREATE POLICY "Invoices owner or admin read"
ON public.invoices
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.payments pay
    JOIN public.profiles p ON p.id = pay.profile_id
    WHERE pay.id = invoices.payment_id
      AND p.auth_user_id = (SELECT auth.uid())
  )
  OR (SELECT private.is_current_user_admin())
);

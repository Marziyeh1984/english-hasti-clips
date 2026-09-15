-- Restore admin access for the site owner account.
-- Safe/idempotent: only inserts the admin role when the matching auth user exists.
-- This does not expose /admin to ordinary authenticated users.
DO $$
DECLARE
  target_user uuid;
BEGIN
  SELECT id INTO target_user
  FROM auth.users
  WHERE lower(email) = lower('Lak20ml@gamil.com')
  LIMIT 1;

  IF target_user IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

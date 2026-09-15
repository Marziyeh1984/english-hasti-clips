-- Grant admin role to the actual login email provided by the site owner.
DO $$
DECLARE
  target_user uuid;
BEGIN
  SELECT id INTO target_user
  FROM auth.users
  WHERE lower(trim(email)) = lower('lak20ml@gmail.com')
  LIMIT 1;

  IF target_user IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

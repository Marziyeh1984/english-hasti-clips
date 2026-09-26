-- Fix profiles for existing users who don't have them
-- This script will create profiles for all auth.users that don't have a profile entry

-- First, create profiles for any auth users that don't have profiles
INSERT INTO public.profiles (id, name, email, created_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', 'بدون نام'),
  COALESCE(u.email, ''),
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Then, create user roles for users who don't have them
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'user'::public.app_role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
AND u.email NOT ILIKE 'lak20ml@gmail.com'; -- Skip admin user

-- Assign admin role to the admin user
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'admin'::public.app_role
FROM auth.users u
WHERE u.email ILIKE 'lak20ml@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = u.id AND ur.role = 'admin'::public.app_role
);

-- Show the results
SELECT 'Profiles after fix:' as info;
SELECT id, name, email, created_at FROM public.profiles ORDER BY created_at DESC;

SELECT 'User roles after fix:' as info;
SELECT ur.user_id, ur.role, p.email 
FROM public.user_roles ur
JOIN public.profiles p ON ur.user_id = p.id
ORDER BY ur.user_id;

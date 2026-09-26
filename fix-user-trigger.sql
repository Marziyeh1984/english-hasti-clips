-- Check and create the trigger function for new user profile creation
-- This function automatically creates a profile entry when a user signs up

-- First, check if the function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user' 
    AND pronamespace = 'public'::regnamespace
  ) THEN
    -- Create the function
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
    BEGIN
      INSERT INTO public.profiles (id, name, email)
      VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name',''), COALESCE(NEW.email,''))
      ON CONFLICT (id) DO NOTHING;
      INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user'::public.app_role)
      ON CONFLICT DO NOTHING;
      RETURN NEW;
    END;
    $$;
    
    RAISE NOTICE 'Function handle_new_user created';
  ELSE
    RAISE NOTICE 'Function handle_new_user already exists';
  END IF;
END $$;

-- Check if the trigger exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE t.tname = 'on_auth_user_created'
    AND n.nspname = 'auth'
    AND c.relname = 'users'
  ) THEN
    -- Create the trigger
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    
    RAISE NOTICE 'Trigger on_auth_user_created created';
  ELSE
    RAISE NOTICE 'Trigger on_auth_user_created already exists';
  END IF;
END $$;

-- Create a test user profile for the admin user if it doesn't exist
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE lower(trim(email)) = lower('lak20ml@gmail.com')
  LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Check if profile exists
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = admin_user_id
    ) THEN
      -- Create profile for admin
      INSERT INTO public.profiles (id, name, email)
      VALUES (admin_user_id, 'Admin', 'lak20ml@gmail.com');
      
      RAISE NOTICE 'Profile created for admin user';
    ELSE
      RAISE NOTICE 'Admin profile already exists';
    END IF;
    
    -- Check if user role exists
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = admin_user_id AND role = 'admin'::public.app_role
    ) THEN
      -- Create admin role
      INSERT INTO public.user_roles (user_id, role)
      VALUES (admin_user_id, 'admin'::public.app_role)
      ON CONFLICT DO NOTHING;
      
      RAISE NOTICE 'Admin role assigned';
    ELSE
      RAISE NOTICE 'Admin role already exists';
    END IF;
  ELSE
    RAISE NOTICE 'Admin user not found in auth.users';
  END IF;
END $$;

-- Test the setup by checking the profiles table
SELECT 'Current profiles:' as info;
SELECT id, name, email, created_at FROM public.profiles ORDER BY created_at DESC;

SELECT 'Current user_roles:' as info;
SELECT ur.user_id, ur.role, p.email 
FROM public.user_roles ur
JOIN public.profiles p ON ur.user_id = p.id
ORDER BY ur.user_id;

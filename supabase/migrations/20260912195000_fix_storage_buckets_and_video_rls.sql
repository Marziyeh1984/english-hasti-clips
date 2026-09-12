-- Fix: storage buckets were never created (previous migration only added policies).
-- Without buckets createSignedUploadUrl / createSignedUrl always fails -> 500 Seroval step 3.
-- Also tighten video RLS comments and ensure receipt bucket exists.

-- Create buckets as private (public = false) so only signed URLs work
insert into storage.buckets (id, name, public)
values
  ('premium-videos', 'premium-videos', false),
  ('thumbnails', 'thumbnails', false),
  ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Ensure storage.objects policies exist (idempotent: drop then recreate)
-- Previous file 20260906211245 created them; recreate here defensively if buckets were recreated.

do $$
begin
  -- receipts: owner can insert/read own folder, admin can read any
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='own receipt upload') then
    create policy "own receipt upload" on storage.objects for insert to authenticated
      with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;

  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='own receipt read') then
    create policy "own receipt read" on storage.objects for select to authenticated
      using (bucket_id = 'receipts' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(),'admin')));
  end if;

  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='admin manage videos storage') then
    create policy "admin manage videos storage" on storage.objects for all to authenticated
      using (bucket_id in ('premium-videos','thumbnails') and public.has_role(auth.uid(),'admin'))
      with check (bucket_id in ('premium-videos','thumbnails') and public.has_role(auth.uid(),'admin'));
  end if;
end $$;

-- Ensure anon/authenticated keep column-level grants (re-assert after any reset)
-- service_role already has ALL on public.videos via initial migration; re-grant for safety
grant select (id, title, description, thumbnail, access_type, created_at) on public.videos to anon;
grant select (id, title, description, thumbnail, access_type, created_at) on public.videos to authenticated;
grant all on public.videos to service_role;
grant all on storage.buckets to service_role;
grant all on storage.objects to service_role;

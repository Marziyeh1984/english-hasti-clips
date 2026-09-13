-- Admins must be able to insert/delete videos via the authenticated client
-- (previous migrations only granted SELECT to anon/authenticated and ALL to service_role).
-- Without this, REST inserts as admin get 403 and the whole flow depends on
-- SUPABASE_SERVICE_ROLE_KEY which may be unset in some Lovable envs.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='videos' and policyname='admin manage videos'
  ) then
    create policy "admin manage videos" on public.videos
      for all to authenticated
      using (public.has_role(auth.uid(), 'admin'))
      with check (public.has_role(auth.uid(), 'admin'));
  end if;
end $$;

-- Ensure has_role remains executable
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

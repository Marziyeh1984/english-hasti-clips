-- Prevent authenticated/anon clients from reading video_url directly via the API,
-- which bypassed the subscription check. The app already never needed this column
-- for listing — only the server-side playback function does, and it now uses the
-- admin client instead.
REVOKE SELECT ON public.videos FROM authenticated;
GRANT SELECT (id, title, description, thumbnail, access_type, created_at) ON public.videos TO authenticated;

REVOKE SELECT ON public.videos FROM anon;
GRANT SELECT (id, title, description, thumbnail, access_type, created_at) ON public.videos TO anon;

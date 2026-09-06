CREATE POLICY "own receipt upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own receipt read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "admin manage videos storage" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id IN ('premium-videos','thumbnails') AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('premium-videos','thumbnails') AND public.has_role(auth.uid(),'admin'));
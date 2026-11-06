-- Fotoğraf yüklemeleri için storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Kullanıcı kendi dosyalarını yükleyebilir (photos/ altına)
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = 'photos'
);

-- Authenticated kullanıcılar yüklenen dosyaları okuyabilir (Edge Function'lar için)
CREATE POLICY "Authenticated users can read uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'uploads');

-- Service role her şeyi yapabilir (Edge Function'lar)
CREATE POLICY "Service role full access on uploads"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');

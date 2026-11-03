-- Seed data: maddeler tablosu için örnek veri
-- T22 görevinde doldurulacak

-- Örnek test maddesi
INSERT INTO public.maddeler (ad, es_anlamlilar, kategori, islev, risk_seviyesi, kaynak, kitle_bayraklari)
VALUES
  ('Sodyum Benzoat', ARRAY['Sodium Benzoate', 'E211'], 'gida', 'Koruyucu madde', 'dikkat', 'https://efsa.europa.eu', '{"bebek": "sakincali", "hamile": "dikkat"}'::jsonb),
  ('Askorbik Asit', ARRAY['Ascorbic Acid', 'E300', 'Vitamin C'], 'gida', 'Antioksidan, vitamin takviyesi', 'guvenli', null, null),
  ('Sodyum Lauril Sülfat', ARRAY['Sodium Lauryl Sulfate', 'SLS'], 'kozmetik', 'Köpürtücü yüzey aktif madde', 'dikkat', null, '{"hassas_cilt": "sakincali", "bebek": "sakincali"}'::jsonb);

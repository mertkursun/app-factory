-- Add alternatives column to urun_analizleri
ALTER TABLE urun_analizleri ADD COLUMN IF NOT EXISTS alternatifler jsonb DEFAULT '[]'::jsonb;

-- Add marka and uretim_ulkesi columns to urun_analizleri
ALTER TABLE urun_analizleri ADD COLUMN IF NOT EXISTS marka text;
ALTER TABLE urun_analizleri ADD COLUMN IF NOT EXISTS uretim_ulkesi text;

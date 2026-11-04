-- Favoriler tablosu
CREATE TABLE IF NOT EXISTS favoriler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analiz_id uuid NOT NULL REFERENCES urun_analizleri(id) ON DELETE CASCADE,
  urun_adi text,
  barkod text,
  skor text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, analiz_id)
);

ALTER TABLE favoriler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON favoriler FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favoriler FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favoriler FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast user-based queries
CREATE INDEX IF NOT EXISTS idx_favoriler_user_id ON favoriler(user_id);
CREATE INDEX IF NOT EXISTS idx_favoriler_analiz_id ON favoriler(analiz_id);

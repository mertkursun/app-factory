-- Family profiles table
CREATE TABLE IF NOT EXISTS aile_profilleri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  isim text NOT NULL,
  ikon text NOT NULL DEFAULT 'user',
  audiences text[] DEFAULT '{}',
  sira int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT max_profiles CHECK (sira < 6)
);

ALTER TABLE aile_profilleri ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own family" ON aile_profilleri FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own family" ON aile_profilleri FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own family" ON aile_profilleri FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own family" ON aile_profilleri FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_aile_profilleri_user_id ON aile_profilleri(user_id);

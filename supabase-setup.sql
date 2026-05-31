-- ERWIN OS – Supabase Setup
-- Einmal im Supabase SQL-Editor ausführen

CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  month DATE NOT NULL UNIQUE,
  revenue NUMERIC(10,2) DEFAULT 0,
  new_clients INTEGER DEFAULT 0,
  conversations INTEGER DEFAULT 0,
  ad_spend NUMERIC(10,2) DEFAULT 0,
  roas NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN ad_spend > 0 THEN ROUND((revenue / ad_spend)::numeric, 2) ELSE 0 END
  ) STORED,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mode TEXT,
  messages JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all metrics" ON metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);

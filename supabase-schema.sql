-- ==============================================================================
-- SUPABASE SCHEMA FOR CLASSROOM LINKS & LIVE DROPS
-- Run this in your Supabase Project: SQL Editor -> New query -> Paste & Run
-- ==============================================================================

-- 1. Create table for live class links
CREATE TABLE IF NOT EXISTS public.class_links (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT DEFAULT 'Shared by instructor during class',
  tag TEXT DEFAULT 'Live Resource',
  category TEXT DEFAULT 'web',
  pinned BOOLEAN DEFAULT false,
  added_at TEXT DEFAULT 'Class Resource',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.class_links ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies so students can read and instructor can manage links
CREATE POLICY "Allow public read access"
  ON public.class_links
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON public.class_links
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON public.class_links
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON public.class_links
  FOR DELETE
  TO public
  USING (true);

-- 4. Enable Realtime broadcast on this table so student screens update instantly!
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_links;

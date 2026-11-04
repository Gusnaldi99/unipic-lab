-- ==============================================================================
-- UNIPIC LAB - SUPABASE DATABASE SCHEMA
-- Jalankan query ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. TABEL BRANDS (KLIEN AGIS)
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT DEFAULT 'General Business',
  social_url TEXT,
  references_text TEXT,
  mandatory_hashtags TEXT[] DEFAULT '{}',
  quota_total INTEGER DEFAULT 15,
  quota_video INTEGER DEFAULT 10,
  quota_graphic INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL CONTENT_CARDS (KARTU KONTEN KALENDER & PIPELINE)
CREATE TABLE IF NOT EXISTS public.content_cards (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  week TEXT DEFAULT 'Week 1',
  format TEXT DEFAULT 'Video',
  platform TEXT DEFAULT 'IG Reels & TikTok',
  pillar TEXT DEFAULT 'Edukasi',
  caption TEXT,
  caption_snippet TEXT,
  notes TEXT,
  status TEXT DEFAULT 'ide',
  due_date TEXT NOT NULL,
  assignee_name TEXT DEFAULT 'Internal Team',
  assignee_role TEXT DEFAULT 'Creator',
  assignee_avatar_bg TEXT DEFAULT '#4338E8',
  link_ref TEXT,
  link_asset TEXT,
  link_hasil TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS) & POLICY AKSES PUBLIK / INTERNAL
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_cards ENABLE ROW LEVEL SECURITY;

-- Policy untuk mengizinkan akses anonim (tim internal menggunakan anon key)
DROP POLICY IF EXISTS "Public access for brands" ON public.brands;
CREATE POLICY "Public access for brands" ON public.brands
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for content_cards" ON public.content_cards;
CREATE POLICY "Public access for content_cards" ON public.content_cards
  FOR ALL USING (true) WITH CHECK (true);

-- 4. INSERT INITIAL SEED DATA DARI CSV JETFIT KARAWACI & MOCK
INSERT INTO public.brands (id, name, code, category, social_url, references_text, mandatory_hashtags, quota_total, quota_video, quota_graphic)
VALUES 
  ('jetfit-karawaci', 'Jet Fitness Karawaci', 'JF', 'Fitness & Gym Center', 'https://www.instagram.com/jetfitnesskarawaci/', 'FTL, WILLFITNESS, STRIDE, FIT HUB', ARRAY['#LetsJetFitTogether', '#JetPeople', '#JetFitnessKarawaci'], 20, 12, 8),
  ('kopiselasar', 'Kopi Selasar Senopati', 'KS', 'F&B Specialty Coffee & Eatery', 'https://www.instagram.com/kopiselasar.id/', 'Fore Coffee, Tomoro, Common Grounds', ARRAY['#KopiSelasar', '#NongkrongSenopati', '#SpecialtyCoffeeJKT'], 16, 10, 6),
  ('glowlab-derma', 'GlowLab Derma Aesthetic', 'GL', 'Beauty & Skincare Clinic', 'https://www.instagram.com/glowlab.aesthetic/', 'Erha Derma, Zap Clinic, Natasha', ARRAY['#GlowLabSkin', '#SkinBarrierHero', '#DermaClinicJKT'], 24, 14, 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.content_cards (id, brand_id, title, week, format, platform, pillar, caption, caption_snippet, notes, status, due_date, assignee_name, assignee_role, assignee_avatar_bg, link_ref, link_asset, link_hasil)
VALUES
  ('jf-01', 'jetfit-karawaci', 'Checklist Sebelum Workout yang Gak Pernah Aku Skip 🏋️‍♀️', 'Week 1', 'Video', 'IG Reels & TikTok', 'Edukasi & Habit', 'Siapa yang masih suka skip pemanasan sebelum angkat beban?\n\n1. 5 menit dynamic stretching\n2. Hidrasi cukup\n3. Warm-up set 50%', 'Pemanasan dinamis, minum elektrolit, dan checklist kunci performa gym...', 'Referensi: Stride Fitness reel.', 'published', '2026-11-03', 'Rian Pratama', 'Video Editor', '#3B6EF5', 'https://www.instagram.com/reel/stridefitness_sample', 'https://drive.google.com/drive/folders/raw_footage_checklist_jf', 'https://drive.google.com/drive/folders/final_render_reels_jf01'),
  ('jf-02', 'jetfit-karawaci', 'Form Deadlift yang Benar vs Bikin Cedera Pinggang', 'Week 1', 'Video', 'IG Reels & TikTok', 'Tips Workout', 'Deadlift bikin pinggang sakit? Posisi lumbar dan shoulder lock harus tepat!', 'Koreksi posisi lumbar dan shoulder lock agar deadlift aman maksimal...', 'Take shoot bareng Coach Dimas.', 'ready', '2026-11-05', 'Rian Pratama', 'Video Editor', '#3B6EF5', 'https://www.tiktok.com/@fitnesscue_sample/video/deadlift', 'https://drive.google.com/drive/folders/footage_deadlift_jf02', 'https://drive.google.com/drive/folders/final_edit_deadlift_jf02'),
  ('jf-03', 'jetfit-karawaci', 'Jadwal Kelas Zumba, Body Combat & Yoga Pekan Ini', 'Week 1', 'Foto + Grafis', 'IG Feed & Story', 'Schedule & Community', 'Jadwal Studio Class Pekan Ini sudah rilis!\n\nSenin: Zumba\nRabu: Body Combat\nJumat: Yoga', 'Yuk booking kelas favoritmu via link bio sebelum kuota penuh...', 'Format carousel 4 slide clean.', 'production', '2026-11-07', 'Sarah Kim', 'Graphic Designer', '#EC4899', 'https://www.instagram.com/p/fithub_schedule_ref', 'https://www.canva.com/design/schedule_template_jf03', 'https://drive.google.com/drive/folders/final_carousel_png_jf03')
ON CONFLICT (id) DO NOTHING;


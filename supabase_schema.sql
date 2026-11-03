-- Jalankan script SQL ini di Supabase SQL Editor:
-- (Buka Supabase Console -> SQL Editor -> Tempel & Run)

-- 1. Buat Tabel recipes
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    time INTEGER NOT NULL DEFAULT 20,
    difficulty TEXT NOT NULL DEFAULT 'Mudah',
    author TEXT NOT NULL DEFAULT 'Koki Resep Kita',
    author_id TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 1,
    image TEXT NOT NULL,
    description TEXT,
    portion_base INTEGER DEFAULT 2,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    steps TEXT[] NOT NULL DEFAULT '{}',
    tips TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Izinkan semua pengunjung membaca seluruh resep (Read Access)
CREATE POLICY "Semua orang bisa membaca resep" 
ON public.recipes 
FOR SELECT 
USING (true);

-- 4. Policy: Izinkan publik/anon menambahkan resep (Insert Access)
CREATE POLICY "Semua orang bisa membagikan resep baru" 
ON public.recipes 
FOR INSERT 
WITH CHECK (true);

-- 5. Data Awal Bawaan (Seed Data)
INSERT INTO public.recipes (title, tags, time, difficulty, author, rating, reviews_count, image, description, portion_base, ingredients, steps, tips)
VALUES
(
  'Ayam Kecap Manis Gurih Rumahan',
  ARRAY['ayam', 'kecap', 'gurih', 'lauk', 'rumahan'],
  25,
  'Mudah',
  'Ibu Ratna',
  4.9,
  142,
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700&auto=format&fit=crop&q=80',
  'Olahan ayam favorit keluarga. Daging empuk berbalut kuah manis legit kecap dengan aroma bawang bombay harum.',
  3,
  '[
    {"name": "Daging ayam (potong kecil)", "qty": 500, "unit": "gram"},
    {"name": "Bawang bombay (iris memanjang)", "qty": 0.5, "unit": "buah"},
    {"name": "Bawang putih (cincang)", "qty": 3, "unit": "siung"},
    {"name": "Kecap manis gurih", "qty": 4, "unit": "sdm"},
    {"name": "Saus tiram", "qty": 1, "unit": "sdm"},
    {"name": "Air bersih", "qty": 150, "unit": "ml"}
  ]'::jsonb,
  ARRAY[
    'Goreng ayam sebentar hingga berkulit kuning kecokelatan, lalu tiriskan.',
    'Tumis bawang putih cincang dan bawang bombay hingga mengeluarkan bau harum.',
    'Masukkan potongan ayam, tambahkan kecap manis, saus tiram, dan sedikit lada.',
    'Tuang air secukupnya, ungkep dengan api kecil sampai kuah mengental dan bumbu meresap ke serat ayam.'
  ],
  'Jangan menggoreng ayam terlalu kering di awal agar daging bagian dalam tetap lembut dan manis meresap.'
),
(
  'Sayur Bening Bayam Jagung Manis',
  ARRAY['sayur', 'sup', 'sehat', 'kuah', 'bening', 'jagung'],
  15,
  'Mudah',
  'Dapur Sehat Nenek',
  4.8,
  110,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80',
  'Sayur bening segar tanpa minyak. Kuah segar dengan rempah temu kunci yang menenangkan lambung dan lezat.',
  3,
  '[
    {"name": "Daun bayam hijau segar", "qty": 2, "unit": "ikat"},
    {"name": "Jagung manis (potong bulat)", "qty": 1, "unit": "tongkol"},
    {"name": "Bawang merah (iris tipis)", "qty": 3, "unit": "butir"},
    {"name": "Temu kunci (memarkan)", "qty": 1, "unit": "ruas"},
    {"name": "Garam & gula secukupnya", "qty": 1, "unit": "sdt"}
  ]'::jsonb,
  ARRAY[
    'Didihkan 800ml air di dalam panci bersama irisan bawang merah dan temu kunci.',
    'Masukkan potongan jagung manis, rebus hingga jagung mulai empuk dan manisnya keluar.',
    'Tambahkan garam dan sedikit gula, aduk rata lalu cicipi rasa kuahnya.',
    'Masukkan daun bayam, masak sebentar saja sekitar 1-2 menit agar warna tetap hijau segar.'
  ],
  'Bayam dimasukkan paling terakhir agar zat gizi dan kesegarannya tetap terjaga optimal.'
),
(
  'Pancake Cokelat Pisang Lembut',
  ARRAY['dessert', 'pancake', 'manis', 'pisang', 'cokelat', 'camilan', 'kue'],
  15,
  'Mudah',
  'Chef Sisca',
  4.9,
  88,
  'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&auto=format&fit=crop&q=80',
  'Dessert manis favorit keluarga. Dibuat dari pisang matang lembut dengan lelehan saus cokelat tanpa perlu mixer.',
  2,
  '[
    {"name": "Pisang matang (lumatkan)", "qty": 2, "unit": "buah"},
    {"name": "Telur ayam", "qty": 2, "unit": "butir"},
    {"name": "Tepung terigu / oat", "qty": 4, "unit": "sdm"},
    {"name": "Saus cokelat / choco chips", "qty": 2, "unit": "sdm"}
  ]'::jsonb,
  ARRAY[
    'Hancurkan pisang matang menggunakan garpu di dalam mangkuk.',
    'Masukkan telur dan tepung, aduk rata perlahan hingga menjadi adonan kental.',
    'Panaskan teflon anti lengket dengan api kecil dan oleskan sedikit mentega.',
    'Tuang 1 centong adonan, tunggu sampai timbul gelembung lalu balik perlahan hingga matang keemasan.'
  ],
  'Gunakan api kecil agar pancake matang lembut merata tanpa gosong.'
);

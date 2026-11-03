-- 1. Buat Tabel recipes jika belum ada
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    time INTEGER NOT NULL DEFAULT 20,
    difficulty TEXT NOT NULL DEFAULT 'Mudah',
    author TEXT NOT NULL DEFAULT 'Pengguna Resep Kita',
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

-- 3. Policy: Izinkan semua orang membaca resep (SELECT)
DROP POLICY IF EXISTS "Semua orang bisa membaca resep" ON public.recipes;
CREATE POLICY "Semua orang bisa membaca resep" 
ON public.recipes 
FOR SELECT 
USING (true);

-- 4. Policy: Izinkan semua orang menambah resep (INSERT)
DROP POLICY IF EXISTS "Semua orang bisa membagikan resep baru" ON public.recipes;
CREATE POLICY "Semua orang bisa membagikan resep baru" 
ON public.recipes 
FOR INSERT 
WITH CHECK (true);

-- 5. Policy: Izinkan memperbarui resep (UPDATE)
DROP POLICY IF EXISTS "Semua orang bisa update resep" ON public.recipes;
CREATE POLICY "Semua orang bisa update resep" 
ON public.recipes 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 6. Policy: Izinkan menghapus resep (DELETE)
DROP POLICY IF EXISTS "Semua orang bisa hapus resep" ON public.recipes;
CREATE POLICY "Semua orang bisa hapus resep" 
ON public.recipes 
FOR DELETE 
USING (true);

-- 7. Bersihkan semua data dummy dari tabel recipes
TRUNCATE TABLE public.recipes;

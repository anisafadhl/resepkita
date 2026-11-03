# Resep Kita (React + TypeScript + Tailwind CSS + Supabase)

Aplikasi katalog dan panduan memasak rumahan ramah segala usia yang responsif, interaktif, dan terintegrasi dengan database cloud **Supabase**.

---

## 🚀 Fitur Utama

1. **Jelajah & Pencarian Cepat**:
   - Pencarian berdasarkan judul resep, bahan baku, atau kategori.
   - Filter kesulitan (Mudah/Sedang) & durasi memasak (Kilat &le; 20m / Santai &le; 40m).
   - Tag rekomendasi populer (Dessert, Ayam, Sayur, Pedas, Hemat).
2. **Rekomendasi Pintar (Personalization)**:
   - Menganalisis preferensi kata kunci yang sering dicari pengguna secara otomatis.
3. **Detail Resep & Kalkulator Porsi Dinamis**:
   - Menghitung takaran bahan secara otomatis jika porsi dinaikkan atau diturunkan.
   - Checklist bahan interaktif saat berbelanja / menyiapkan bahan.
4. **Mode Memasak Fokus (Guided Cooking Mode)**:
   - Tampilan per langkah jelas untuk kenyamanan di dapur.
   - Bantuan suara (*Text-to-Speech*) berbahasa Indonesia.
   - Timer dapur terintegrasi dengan notifikasi audio.
   - Efek kembang api (*confetti*) saat selesai memasak.
5. **Autentikasi & Publikasi Resep**:
   - Pengunjung bebas membaca resep tanpa login.
   - Fitur login koki saat ingin membagikan resep baru atau melihat resep buatan sendiri.
6. **Integrasi Supabase & Fallback Offline**:
   - Terintegrasi langsung dengan Supabase PostgreSQL & Row Level Security.
   - Jika Supabase belum dikonfigurasi, sistem otomatis menggunakan penyimpanan `localStorage` agar aplikasi tetap berjalan 100% tanpa error.

---

## 🛠️ Cara Menjalankan Project

### 1. Menjalankan Server Development
```bash
npm run dev
```
Akses di browser: `http://localhost:5173`

### 2. Membangun untuk Produksi
```bash
npm run build
```

---

## 🗄️ Menghubungkan ke Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Masuk ke **SQL Editor** di dashboard Supabase.
3. Buka file [`supabase_schema.sql`](./supabase_schema.sql) di project ini, salin seluruh kodenya, lalu klik **Run** di SQL Editor.
4. Salin file `.env.example` ke `.env`:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```
5. Restart Vite dev server (`npm run dev`). Status badge di header akan berubah menjadi **Supabase** (hijau).

---

## 📂 Struktur File Utama

- `src/types/recipe.ts`: Tipe data TypeScript untuk resep dan profil pengguna.
- `src/lib/supabase.ts`: Konfigurasi client Supabase.
- `src/context/RecipeContext.tsx`: State management resep, bookmark, filter minat, dan Supabase sync.
- `src/components/`:
  - `Header.tsx`: Navigasi atas, pencarian, status Supabase, dan aksi pengguna.
  - `RecipeCard.tsx`: Tampilan kartu masakan dengan rating & bookmark.
  - `Recommendations.tsx`: Rekomendasi pintar sesuai minat pengguna.
  - `RecipeDetailModal.tsx`: Modal detail lengkap & kalkulator porsi.
  - `CookingModeModal.tsx`: Mode memasak fokus, TTS, dan timer.
  - `AddRecipeModal.tsx`: Formulir penerbitan resep baru.
  - `LoginModal.tsx`: Modal masuk akun koki.
  - `MobileNav.tsx`: Navigasi bawah ramah sentuhan untuk smartphone.
- `supabase_schema.sql`: Skrip SQL tabel, RLS policy, dan data awal resep.

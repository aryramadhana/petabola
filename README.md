# PetaBola ⚽

Aplikasi web persebaran klub sepak bola Indonesia — Liga 1, Liga 2, Liga 3.

## Stack
- **Next.js 15** (App Router + Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **Leaflet** untuk peta interaktif
- **Supabase** (siap diintegrasikan — lihat `lib/supabase.ts`)

## Struktur Folder

```
petabola/
├── app/
│   ├── page.tsx              # Homepage (peta utama)
│   ├── MapApp.tsx            # Client orchestrator
│   ├── layout.tsx            # Root layout + fonts
│   ├── globals.css           # Tailwind + overrides
│   ├── api/clubs/route.ts    # API endpoint clubs
│   ├── klub/
│   │   ├── page.tsx          # Listing semua klub
│   │   └── [slug]/page.tsx   # Detail klub
│   └── components/
│       ├── map/
│       │   └── MapView.tsx   # Leaflet map (client-only)
│       └── ui/
│           ├── Header.tsx    # Header + search
│           ├── Sidebar.tsx   # Desktop sidebar
│           ├── MobileDrawer.tsx # Mobile bottom sheet
│           ├── LeagueBadge.tsx
│           └── ClubAvatar.tsx
├── data/
│   └── clubs.json            # ← Edit file ini untuk tambah/ubah klub
├── lib/
│   ├── clubs.ts              # Helper & filter functions
│   └── supabase.ts           # Supabase client
└── types/
    └── index.ts              # TypeScript types
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (opsional, untuk Supabase)
cp .env.local.example .env.local
# isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Jalankan development server
npm run dev

# 4. Buka http://localhost:3000
```

## Menambah Klub Baru

Edit `data/clubs.json` dan tambahkan objek baru:

```json
{
  "id": "nama-klub-slug",
  "name": "Nama Klub FC",
  "abbr": "NKF",
  "city": "Kota",
  "province": "Provinsi",
  "region": "Jawa",          // Jawa | Sumatra | Kalimantan | Sulawesi | Bali & Nusa Tenggara | Papua & Maluku
  "stadium": "Nama Stadion",
  "stadiumCapacity": 20000,
  "founded": 1990,
  "nickname": "Julukan Klub",
  "supporters": "Nama Suporter",
  "league": "Liga 1",        // Liga 1 | Liga 2 | Liga 3
  "lat": -6.2183,
  "lng": 106.8027
}
```

## Migrasi ke Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Buat tabel `clubs` dengan kolom sesuai `types/index.ts`
3. Import data dari `data/clubs.json`
4. Uncomment kode Supabase di `app/api/clubs/route.ts`
5. Isi `.env.local` dengan credentials

## Deploy ke Vercel

```bash
npx vercel --prod
```

Atau connect repo ke [vercel.com](https://vercel.com) untuk auto-deploy.

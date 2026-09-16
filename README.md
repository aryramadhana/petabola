# PetaBola

Direktori klub sepak bola Indonesia yang berbasis peta menjelajahi berdasarkan lokasi, liga, kota, dan provinsi.

**Demo:** https://petabola.vercel.app

> Proyek portofolio pribadi. Repositori ini dipublikasikan untuk dibaca dan ditinjau, bukan untuk digunakan ulang — lihat [Hak Cipta](#hak-cipta).

## Masalah

Informasi klub sepak bola Indonesia tersebar di banyak tempat dan hampir selalu disajikan sebagai daftar teks. Padahal pertanyaan yang sering muncul justru bersifat geografis: klub apa saja yang ada di provinsi saya, klub ini bermarkas di kota mana. PetaBola menjawabnya dengan menjadikan peta sebagai pintu masuk utama, bukan sekadar hiasan.

## Fitur

- **Peta interaktif** — setiap klub menjadi pin berwarna sesuai tingkat liganya, bebas di-zoom dan digeser ke seluruh Peta.
- **Panel detail klub** — panel yang muncul dari sisi peta saat sebuah klub dipilih, dan berubah menjadi bottom sheet di layar kecil.
- **Filter dan pencarian** — filter berdasarkan liga, atau cari lewat nama, singkatan, kota, provinsi, julukan, hingga nama kelompok suporter.
- **Halaman liga** — klasemen, jadwal, hasil, serta daftar top skor dan top assist per musim.
- **Mode gelap** — mengikuti preferensi sistem, dengan palet aksen yang ikut berganti identitas.

<!-- ## Arsitektur

Next.js App Router dengan pemisahan server/klien yang tegas:

- **Server Component** mengambil data di sisi server, lalu menyerahkannya ke satu orchestrator klien yang memegang seluruh state interaksi peta — komponen peta sendiri dimuat client-only karena Leaflet menyentuh `window`.
- **Lapisan akses data dipecah per domain** di `lib/` (klub, liga, musim, pertandingan, klasemen, statistik pemain), sehingga tiap halaman hanya menarik yang benar-benar dibutuhkannya.
- **Kesegaran data memakai on-demand revalidation murni** — halaman di-cache tanpa batas waktu, lalu sebuah webhook basis data memicu revalidasi hanya ketika tabel terkait benar-benar berubah.
- **Beranda adalah satu halaman** dengan tiga seksi ber-anchor (Beranda, Liga, Tentang); hanya halaman detail liga yang berdiri sebagai rute terpisah. -->


## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v3 · Leaflet · Supabase (PostgreSQL + RLS) · next-themes · Vercel

## Status

MVP publik dan sudah live. Data diperbarui secara manual dan berkala — tanpa skor langsung, tanpa konten editorial, dan bukan situs resmi liga mana pun. Sebagian dataset, terutama klasemen dan sebagian jadwal, masih menunggu sumber yang dapat diverifikasi dan sampai saat itu tampil sebagai empty state.

## Hak Cipta

Copyright © 2026 Hary R Nasution. Seluruh hak dilindungi.

Repositori ini **publik untuk dibaca, bukan open source**. Kode dan desainnya boleh ditinjau untuk keperluan penilaian portofolio, tetapi tidak untuk disalin, dimodifikasi, di-deploy ulang, atau dijadikan dasar proyek lain tanpa izin tertulis. Selengkapnya di [`LICENSE`](LICENSE).

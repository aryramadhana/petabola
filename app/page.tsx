import { getAllClubs } from "@/lib/clubs";
import { HomePage } from "./HomePage";

export const revalidate = 3600;

export default async function Page() {
  // Server-side: ambil dari Supabase, di-refresh otomatis tiap 1 jam (ISR).
  // Sorted A-Z by name across all leagues — Beranda-only ordering, doesn't
  // affect /klub/[slug] or /liga/[slug] which fetch club data separately.
  const clubs = (await getAllClubs())
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  return <HomePage clubs={clubs} />;
}

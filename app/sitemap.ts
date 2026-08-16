import type { MetadataRoute } from "next";
import { getAllClubs } from "@/lib/clubs";
import { getAllLeagues } from "@/lib/leagues";

// Placeholder domain — belum ada domain produksi final saat file ini
// ditulis. Ganti bareng dengan BASE_URL di app/robots.ts begitu domain
// aslinya sudah fix.
const BASE_URL = "https://petabola.id";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clubs = await getAllClubs();
  const leagues = await getAllLeagues();

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    changeFrequency: "weekly",
    priority: 1,
  };

  const leagueEntries: MetadataRoute.Sitemap = leagues.map((league) => ({
    url: `${BASE_URL}/liga/${league.id}`,
    lastModified: league.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // No club record has an `updatedAt` field yet (see CLAUDE.md) — omitting
  // `lastModified` here rather than guessing a date for it.
  const clubEntries: MetadataRoute.Sitemap = clubs.map((club) => ({
    url: `${BASE_URL}/klub/${club.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [homeEntry, ...leagueEntries, ...clubEntries];
}

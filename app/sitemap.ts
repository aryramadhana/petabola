import type { MetadataRoute } from "next";
import { getAllClubs } from "@/lib/clubs";
import { getAllLeagues } from "@/lib/leagues";

const BASE_URL = "https://petabola.vercel.app";

export const revalidate = false;

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

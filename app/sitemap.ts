import type { MetadataRoute } from "next";
import { getAllLeagues } from "@/lib/leagues";

const BASE_URL = "https://petabola.vercel.app";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  return [homeEntry, ...leagueEntries];
}

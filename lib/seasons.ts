import seasonsData from "@/data/seasons.json";
import type { Season } from "@/types/season";

function getAllSeasons(): Season[] {
  return seasonsData as Season[];
}

export function getActiveSeasonForLeague(leagueId: string): Season | undefined {
  return getAllSeasons().find(
    (s) => s.leagueId === leagueId && s.status === "active"
  );
}

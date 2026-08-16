import liga1 from "@/data/standings/liga-1.json";
import liga2Barat from "@/data/standings/liga-2-barat.json";
import liga2Timur from "@/data/standings/liga-2-timur.json";
import liga3 from "@/data/standings/liga-3.json";
import type { StandingsData, StandingsRow } from "@/types/standing";

const BY_LEAGUE: Record<string, StandingsData> = {
  "liga-1": liga1 as StandingsData,
  "liga-2-barat": liga2Barat as StandingsData,
  "liga-2-timur": liga2Timur as StandingsData,
  "liga-3": liga3 as StandingsData,
};

function key(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

export function getStandings(leagueId: string, groupId?: string): StandingsData | undefined {
  return BY_LEAGUE[key(leagueId, groupId)];
}

export function getSortedStandingsRows(leagueId: string, groupId?: string): StandingsRow[] {
  const data = getStandings(leagueId, groupId);
  if (!data) return [];
  return [...data.rows].sort((a, b) => a.position - b.position);
}

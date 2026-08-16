import liga1 from "@/data/matches/liga-1.json";
import liga2Barat from "@/data/matches/liga-2-barat.json";
import liga2Timur from "@/data/matches/liga-2-timur.json";
import liga3 from "@/data/matches/liga-3.json";
import type { Match, MatchesData } from "@/types/match";

const BY_LEAGUE: Record<string, MatchesData> = {
  "liga-1": liga1 as MatchesData,
  "liga-2-barat": liga2Barat as MatchesData,
  "liga-2-timur": liga2Timur as MatchesData,
  "liga-3": liga3 as MatchesData,
};

function key(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

export function getMatchesData(leagueId: string, groupId?: string): MatchesData | undefined {
  return BY_LEAGUE[key(leagueId, groupId)];
}

export function getFixtures(leagueId: string, groupId?: string): Match[] {
  const data = getMatchesData(leagueId, groupId);
  if (!data) return [];
  return data.matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function getResults(leagueId: string, groupId?: string): Match[] {
  const data = getMatchesData(leagueId, groupId);
  if (!data) return [];
  return data.matches
    .filter(
      (m) =>
        m.status === "finished" ||
        m.status === "postponed" ||
        m.status === "cancelled"
    )
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

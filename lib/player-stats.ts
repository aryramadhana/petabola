import liga1 from "@/data/player-stats/liga-1.json";
import liga2Barat from "@/data/player-stats/liga-2-barat.json";
import liga2Timur from "@/data/player-stats/liga-2-timur.json";
import liga3 from "@/data/player-stats/liga-3.json";
import type { PlayerStat, PlayerStatsData } from "@/types/player-stat";

const BY_LEAGUE: Record<string, PlayerStatsData> = {
  "liga-1": liga1 as PlayerStatsData,
  "liga-2-barat": liga2Barat as PlayerStatsData,
  "liga-2-timur": liga2Timur as PlayerStatsData,
  "liga-3": liga3 as PlayerStatsData,
};

function key(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

export function getPlayerStatsData(leagueId: string, groupId?: string): PlayerStatsData | undefined {
  return BY_LEAGUE[key(leagueId, groupId)];
}

export function getTopScorers(leagueId: string, limit = 10, groupId?: string): PlayerStat[] {
  const data = getPlayerStatsData(leagueId, groupId);
  if (!data) return [];
  return [...data.players].sort((a, b) => b.goals - a.goals).slice(0, limit);
}

export function getTopAssists(leagueId: string, limit = 10, groupId?: string): PlayerStat[] {
  const data = getPlayerStatsData(leagueId, groupId);
  if (!data) return [];
  return [...data.players].sort((a, b) => b.assists - a.assists).slice(0, limit);
}

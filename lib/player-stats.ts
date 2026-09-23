import { supabase } from "@/lib/supabase";
import type { PlayerStat, PlayerStatsData } from "@/types/player-stat";

function rowId(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

export async function getPlayerStatsData(leagueId: string, groupId?: string): Promise<PlayerStatsData | undefined> {
  const id = rowId(leagueId, groupId);
  const { data, error } = await supabase
    .from("player_stats")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(`Gagal mengambil data statistik pemain "${id}" dari Supabase: ${error.message}`);
  }
  if (!data) return undefined;
  return {
    seasonId: data.seasonId,
    updatedAt: data.updatedAt,
    players: data.players as PlayerStat[],
  };
}

/**
 * Assist chart, still hand-entered via the `player_stats` table — match data
 * records scorers only, so this one cannot be derived. Players whose assist
 * count is unknown are left out rather than ranked as zero.
 *
 * The scoring chart is derived instead; see lib/player-stats-calc.ts.
 */
export async function getTopAssists(leagueId: string, limit = 10, groupId?: string): Promise<PlayerStat[]> {
  const data = await getPlayerStatsData(leagueId, groupId);
  if (!data) return [];
  return data.players
    .filter((p) => p.assists !== null)
    .sort((a, b) => b.assists! - a.assists!)
    .slice(0, limit);
}

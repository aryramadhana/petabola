import { supabase } from "@/lib/supabase";
import type { StandingsData, StandingsRow } from "@/types/standing";

function rowId(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

export async function getStandings(leagueId: string, groupId?: string): Promise<StandingsData | undefined> {
  const id = rowId(leagueId, groupId);
  const { data, error } = await supabase
    .from("standings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(`Gagal mengambil data klasemen "${id}" dari Supabase: ${error.message}`);
  }
  if (!data) return undefined;
  return {
    seasonId: data.seasonId,
    updatedAt: data.updatedAt,
    rows: data.rows as StandingsRow[],
  };
}

export async function getSortedStandingsRows(leagueId: string, groupId?: string): Promise<StandingsRow[]> {
  const data = await getStandings(leagueId, groupId);
  if (!data) return [];
  return [...data.rows].sort((a, b) => a.position - b.position);
}

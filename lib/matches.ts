import { supabase } from "@/lib/supabase";
import type { Match, MatchesData } from "@/types/match";

function rowId(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

export async function getMatchesData(leagueId: string, groupId?: string): Promise<MatchesData | undefined> {
  const id = rowId(leagueId, groupId);
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(`Gagal mengambil data pertandingan "${id}" dari Supabase: ${error.message}`);
  }
  if (!data) return undefined;
  return {
    seasonId: data.seasonId,
    updatedAt: data.updatedAt,
    matches: data.matches as Match[],
  };
}

export async function getFixtures(leagueId: string, groupId?: string): Promise<Match[]> {
  const data = await getMatchesData(leagueId, groupId);
  if (!data) return [];
  return data.matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export async function getResults(leagueId: string, groupId?: string): Promise<Match[]> {
  const data = await getMatchesData(leagueId, groupId);
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

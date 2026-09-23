import { supabase } from "@/lib/supabase";
import { getMatchesData } from "@/lib/matches";
import { computeStandings } from "@/lib/standings-calc";
import type { PointAdjustment, StandingsData, StandingsRow } from "@/types/standing";

function rowId(leagueId: string, groupId?: string): string {
  return groupId ? `${leagueId}-${groupId}` : leagueId;
}

/**
 * The `standings` row is no longer the table itself — it is the manual
 * adjustment layer sitting on top of the computed one (points deductions and
 * the like). Its `rows` column is unread; see lib/standings-calc.ts.
 */
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
    adjustments: (data.adjustments ?? []) as PointAdjustment[],
  };
}

/**
 * Build a league['s group] table from its match results.
 *
 * `clubIds` comes from the caller because the page has already fetched and
 * group-filtered the club list; refetching it here would duplicate a query.
 */
export async function getStandingsRows(
  leagueId: string,
  clubIds: string[],
  groupId?: string
): Promise<StandingsRow[]> {
  const [matchesData, standingsData] = await Promise.all([
    getMatchesData(leagueId, groupId),
    getStandings(leagueId, groupId),
  ]);
  return computeStandings(
    matchesData?.matches ?? [],
    clubIds,
    standingsData?.adjustments ?? []
  );
}

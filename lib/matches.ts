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

// Synchronous selectors over an already-fetched match list, following the same
// split as getActiveSeasonForLeague()/getLeagueGroups(). They used to fetch the
// row themselves, which meant one league page issued the same query three or
// four times over — and standings now need the same blob again. Fetch
// getMatchesData() once per league[-group] and feed both of these from it.

export function getFixtures(matches: Match[]): Match[] {
  return matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

/**
 * Everything that is no longer upcoming. Note this deliberately includes
 * `postponed`/`cancelled`, which have no result to show — standings must
 * filter for `finished` themselves rather than reuse this.
 */
export function getResults(matches: Match[]): Match[] {
  return matches
    .filter(
      (m) =>
        m.status === "finished" ||
        m.status === "postponed" ||
        m.status === "cancelled"
    )
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

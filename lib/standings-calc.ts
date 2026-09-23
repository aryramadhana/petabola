import type { Match } from "@/types/match";
import type { PointAdjustment, StandingsRow } from "@/types/standing";

// Pure standings calculator — deliberately imports nothing from lib/supabase,
// so the whole ranking procedure can be exercised without a network or a
// database. The `compute*` name breaks lib/'s `get*` convention on purpose:
// this is a calculator, not a data accessor.

const WIN_POINTS = 3;
const DRAW_POINTS = 1;

interface Tally {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

/** Head-to-head aggregate for one club, scoped to a single tied group. */
interface HeadToHead {
  points: number;
  goalDifference: number;
  goalsFor: number;
}

function emptyTally(clubId: string): Tally {
  return {
    clubId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };
}

/**
 * A match only counts once it has actually been played AND carries a score.
 * `postponed`/`cancelled` are excluded here even though `getResults()` lists
 * them under "Hasil" — they contribute nothing to a table.
 */
function isPlayed(m: Match): m is Match & { homeScore: number; awayScore: number } {
  return m.status === "finished" && m.homeScore !== null && m.awayScore !== null;
}

function applyScore(tally: Tally, scored: number, conceded: number): void {
  tally.played += 1;
  tally.goalsFor += scored;
  tally.goalsAgainst += conceded;
  if (scored > conceded) {
    tally.won += 1;
    tally.points += WIN_POINTS;
  } else if (scored === conceded) {
    tally.drawn += 1;
    tally.points += DRAW_POINTS;
  } else {
    tally.lost += 1;
  }
}

function goalDifference(t: Tally): number {
  return t.goalsFor - t.goalsAgainst;
}

/**
 * Head-to-head mini-league across `group` only: every finished match where
 * BOTH clubs belong to the tied group. Point adjustments are deliberately not
 * applied here — Pasal 10 scopes this sub-ranking to the matches those clubs
 * played against each other.
 */
function headToHead(group: Tally[], matches: Match[]): Map<string, HeadToHead> {
  const ids = new Set(group.map((t) => t.clubId));
  const table = new Map<string, HeadToHead>();
  for (const id of ids) {
    table.set(id, { points: 0, goalDifference: 0, goalsFor: 0 });
  }

  for (const m of matches) {
    if (!isPlayed(m)) continue;
    if (!ids.has(m.homeClubId) || !ids.has(m.awayClubId)) continue;

    const home = table.get(m.homeClubId)!;
    const away = table.get(m.awayClubId)!;

    home.goalsFor += m.homeScore;
    home.goalDifference += m.homeScore - m.awayScore;
    away.goalsFor += m.awayScore;
    away.goalDifference += m.awayScore - m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.points += WIN_POINTS;
    } else if (m.homeScore === m.awayScore) {
      home.points += DRAW_POINTS;
      away.points += DRAW_POINTS;
    } else {
      away.points += WIN_POINTS;
    }
  }

  return table;
}

/**
 * Final fallback once head-to-head has been exhausted or discarded:
 * overall goal difference, then overall goals scored, then club id A–Z.
 *
 * Pasal 10 puts fair play before a drawn lot at this point, but `Match` holds
 * no card data at all, so that criterion is not computable. The alphabetical
 * last resort replaces the regulation's drawn lot so the output stays
 * deterministic — a random order would reshuffle the table on every rebuild.
 */
function compareOverall(a: Tally, b: Tally): number {
  return (
    goalDifference(b) - goalDifference(a) ||
    b.goalsFor - a.goalsFor ||
    a.clubId.localeCompare(b.clubId)
  );
}

/**
 * Has every club in the tied group finished both legs against every other club
 * in it? Head-to-head is only meaningful once the mini-league between them is
 * complete: part-way through, a club that has played one in-group match is
 * being compared against one that has played none.
 *
 * This is not hypothetical. On matchweek 3 of 2026/27, Borneo, Persib and Bali
 * were level on 6 points and Borneo had beaten Bali 1-0 — yet the official
 * table ranked Borneo last of the three, on goal difference alone. The
 * operator's running table does not apply head-to-head; the criterion decides
 * the final classification, once everyone has met everyone twice.
 *
 * Requiring both legs rather than a fixed fixture count keeps this independent
 * of how many matchweeks happen to be loaded: fixtures are entered as the
 * season goes, so "every meeting on record is played" would be satisfied by a
 * single completed first leg.
 */
function hasCompleteHeadToHead(group: Tally[], matches: Match[]): boolean {
  const ids = group.map((t) => t.clubId);
  const played = new Set(
    matches
      .filter((m) => isPlayed(m))
      .map((m) => `${m.homeClubId}>${m.awayClubId}`)
  );

  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      if (!played.has(`${ids[i]}>${ids[j]}`)) return false;
      if (!played.has(`${ids[j]}>${ids[i]}`)) return false;
    }
  }
  return true;
}

/**
 * Rank clubs that are level on points, per Pasal 10.
 *
 * Head-to-head is attempted first, but only once every club in the group has
 * completed both legs against every other (see hasCompleteHeadToHead). If it
 * separates nobody, the whole head-to-head result is discarded and the group
 * falls through to overall goal difference. If it separates some but not all,
 * the surviving sub-groups are resolved by running the same procedure again on
 * the smaller set.
 */
function resolveTie(group: Tally[], matches: Match[]): Tally[] {
  if (group.length < 2) return group;
  if (!hasCompleteHeadToHead(group, matches)) {
    return [...group].sort(compareOverall);
  }

  const h2h = headToHead(group, matches);
  const byH2H = [...group].sort((a, b) => {
    const x = h2h.get(a.clubId)!;
    const y = h2h.get(b.clubId)!;
    return (
      y.points - x.points ||
      y.goalDifference - x.goalDifference ||
      y.goalsFor - x.goalsFor
    );
  });

  // Split into runs that head-to-head could not tell apart.
  const blocks: Tally[][] = [];
  for (const tally of byH2H) {
    const current = blocks[blocks.length - 1];
    if (current) {
      const a = h2h.get(current[0].clubId)!;
      const b = h2h.get(tally.clubId)!;
      if (
        a.points === b.points &&
        a.goalDifference === b.goalDifference &&
        a.goalsFor === b.goalsFor
      ) {
        current.push(tally);
        continue;
      }
    }
    blocks.push([tally]);
  }

  // Head-to-head separated nobody: discard it entirely and fall through.
  if (blocks.length === 1) {
    return [...group].sort(compareOverall);
  }

  // Head-to-head separated some: keep that order, recurse into what is left.
  // Each recursive call gets a strictly smaller set, so this terminates.
  return blocks.flatMap((block) => resolveTie(block, matches));
}

/**
 * Build a league table from match results.
 *
 * Returns `[]` when no match has been played yet — never rows full of zeros.
 * `0` in this project means "known to be zero"; an unplayed season is unknown,
 * and `StandingsTable` has its own club-list-with-dashes fallback for it.
 */
export function computeStandings(
  matches: Match[],
  clubIds: string[],
  adjustments: PointAdjustment[] = []
): StandingsRow[] {
  const eligible = new Set(clubIds);
  const played = matches.filter(
    (m) => isPlayed(m) && eligible.has(m.homeClubId) && eligible.has(m.awayClubId)
  );
  if (played.length === 0) return [];

  // Every club in the league appears, including ones yet to play a match.
  const tallies = new Map<string, Tally>();
  for (const id of clubIds) {
    tallies.set(id, emptyTally(id));
  }

  for (const m of played) {
    // Non-null assertion is safe: `played` is already filtered to matches
    // whose two clubs are both in `eligible`, and every eligible club was
    // seeded above. Orphaned clubId references — a known hazard whenever a
    // club changes league — are dropped by that same filter rather than
    // silently creating a phantom row.
    applyScore(tallies.get(m.homeClubId)!, m.homeScore!, m.awayScore!);
    applyScore(tallies.get(m.awayClubId)!, m.awayScore!, m.homeScore!);
  }

  for (const adj of adjustments) {
    const tally = tallies.get(adj.clubId);
    if (tally) tally.points += adj.points;
  }

  // Group by final points (deductions included), then break each tie.
  const ranked = [...tallies.values()]
    .sort((a, b) => b.points - a.points)
    .reduce<Tally[][]>((groups, tally) => {
      const current = groups[groups.length - 1];
      if (current && current[0].points === tally.points) current.push(tally);
      else groups.push([tally]);
      return groups;
    }, [])
    .flatMap((group) => resolveTie(group, played));

  return ranked.map((t, i) => ({
    position: i + 1,
    clubId: t.clubId,
    played: t.played,
    won: t.won,
    drawn: t.drawn,
    lost: t.lost,
    goalsFor: t.goalsFor,
    goalsAgainst: t.goalsAgainst,
    goalDifference: goalDifference(t),
    points: t.points,
  }));
}

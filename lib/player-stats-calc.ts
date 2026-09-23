import type { Match } from "@/types/match";
import type { PlayerStat } from "@/types/player-stat";

// Pure top-scorer calculator, same shape and intent as lib/standings-calc.ts:
// no Supabase import, so it can be exercised without a database.

function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Derive the scoring chart from match goal detail.
 *
 * Own goals are skipped rather than credited to anyone: `MatchGoal.clubId`
 * names the club that *benefited*, not the player's own club, so counting
 * them would file the scorer under the opposition.
 *
 * `assists` comes back `null`, not `0` — the match data records who scored
 * and nothing else, so an assist count is unknown, and unknown is not zero.
 */
export function computeTopScorers(matches: Match[], limit = 10): PlayerStat[] {
  const tally = new Map<string, PlayerStat>();

  for (const m of matches) {
    if (m.status !== "finished") continue;
    for (const goal of m.goals ?? []) {
      if (goal.ownGoal) continue;

      const key = `${goal.clubId}::${goal.player}`;
      const existing = tally.get(key);
      if (existing) {
        existing.goals += 1;
        continue;
      }
      tally.set(key, {
        id: `${slug(goal.player)}-${goal.clubId}`,
        name: goal.player,
        clubId: goal.clubId,
        goals: 1,
        assists: null,
      });
    }
  }

  return [...tally.values()]
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, limit);
}

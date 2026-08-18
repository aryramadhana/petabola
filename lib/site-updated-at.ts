import { supabase } from "@/lib/supabase";

async function maxUpdatedAt(table: string): Promise<string | null> {
  const { data, error } = await supabase.from(table).select("updatedAt");
  if (error) {
    throw new Error(`Gagal mengambil updatedAt dari tabel "${table}": ${error.message}`);
  }
  const dates = (data ?? [])
    .map((row) => row.updatedAt as string | null)
    .filter((d): d is string => !!d);
  if (dates.length === 0) return null;
  return dates.reduce((latest, d) => (d > latest ? d : latest));
}

// Site-wide "last updated" date for the Tentang section's overview card —
// the max updatedAt across every league-domain table (leagues/matches/
// standings/player_stats). `clubs`/`seasons` have no updatedAt field yet
// (see root CLAUDE.md's Known Issues), so they're excluded rather than
// guessed.
export async function getLastDataUpdate(): Promise<string | null> {
  const results = await Promise.all([
    maxUpdatedAt("leagues"),
    maxUpdatedAt("matches"),
    maxUpdatedAt("standings"),
    maxUpdatedAt("player_stats"),
  ]);
  const dates = results.filter((d): d is string => !!d);
  if (dates.length === 0) return null;
  return dates.reduce((latest, d) => (d > latest ? d : latest));
}

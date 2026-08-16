import { supabase } from "@/lib/supabase";
import type { Season } from "@/types/season";

export async function getAllSeasons(): Promise<Season[]> {
  const { data, error } = await supabase.from("seasons").select("*");
  if (error) {
    throw new Error(`Gagal mengambil data musim dari Supabase: ${error.message}`);
  }
  return data as Season[];
}

export function getActiveSeasonForLeague(seasons: Season[], leagueId: string): Season | undefined {
  return seasons.find((s) => s.leagueId === leagueId && s.status === "active");
}

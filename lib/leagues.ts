import { supabase } from "@/lib/supabase";
import type { LeagueGroup, LeagueInfo } from "@/types/league";
import type { League } from "@/types";

export async function getAllLeagues(): Promise<LeagueInfo[]> {
  const { data, error } = await supabase.from("leagues").select("*").order("level");
  if (error) {
    throw new Error(`Gagal mengambil data liga dari Supabase: ${error.message}`);
  }
  return data as LeagueInfo[];
}

export async function getLeagueById(id: string): Promise<LeagueInfo | null> {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(`Gagal mengambil data liga "${id}" dari Supabase: ${error.message}`);
  }
  return data as LeagueInfo | null;
}

export function getLeagueGroups(league: LeagueInfo): LeagueGroup[] {
  return league.groups ?? [];
}

// Sponsor/brand names used only for prominent heading display — the
// underlying League union ("Liga 1"/"Liga 2"/"Liga 3") stays the stable
// internal identifier everywhere else (data linking, filters, badges,
// color lookups), since those names are too long for compact UI and
// changing the identifier itself would cascade through club records.
const LEAGUE_DISPLAY_NAMES: Record<League, string> = {
  "Liga 1": "BRI Super League",
  "Liga 2": "Pegadaian Championship",
  "Liga 3": "Liga Nusantara",
};

export function getLeagueDisplayName(league: League): string {
  return LEAGUE_DISPLAY_NAMES[league] ?? league;
}

// Filenames in public/logos/liga/ don't follow a derivable pattern from
// league.id (mixed case/extension), so map them explicitly.
const LEAGUE_LOGOS: Record<string, string> = {
  "liga-1": "/logos/liga/Liga_1.svg",
  "liga-2": "/logos/liga/Liga_2.png",
  "liga-3": "/logos/liga/Liga_3.png",
};

export function getLeagueLogo(id: string): string | undefined {
  return LEAGUE_LOGOS[id];
}

import type { Club, FilterLeague, FilterRegion, League } from "@/types";
import { supabase } from "@/lib/supabase";

const LEAGUE_COLORS: Record<League, string> = {
  "Liga 1": "#00529c",
  "Liga 2": "#008244",
  "Liga 3": "#0c2340",
};

// Darkened, WCAG AA-safe variants of LEAGUE_COLORS for small text use
// (badges, stat numbers, pin labels) — the base hues fail 4.5:1 on white/slate.
// Liga 1 and Liga 3's bases are already dark/saturated enough (7.82:1 and
// 15.79:1 on white respectively) to double as their own text-safe variant.
const LEAGUE_TEXT_COLORS: Record<League, string> = {
  "Liga 1": "#00529c",
  "Liga 2": "#006837",
  "Liga 3": "#0c2340",
};

// Light tints of each league hue for text/icons on dark surfaces — the
// AA-safe LEAGUE_TEXT_COLORS values above are tuned for white/slate
// backgrounds and fall below 3:1 contrast on a dark navy surface.
const LEAGUE_TEXT_COLORS_DARK: Record<League, string> = {
  "Liga 1": "#669ccc",
  "Liga 2": "#79d2a8",
  "Liga 3": "#79a1d2",
};

// NOTE: kept as fully literal strings (not template-interpolated from the
// maps above) on purpose — Tailwind's build-time class scanner needs the
// literal "bg-[#xxxxxx]"/"text-[#xxxxxx]" tokens to appear verbatim in the
// source to generate them; interpolated values would be invisible to it.
// Liga 3's dark-mode chip uses its light tint (not its near-black base) for
// the background fill — the base is barely distinguishable from the dark
// page bg (#0d1b2a), unlike Liga 1/2's much brighter bases.
export const LEAGUE_BG: Record<League, string> = {
  "Liga 1": "bg-[#00529c]/10 dark:bg-[#00529c]/20 text-[#00529c] dark:text-[#669ccc]",
  "Liga 2": "bg-[#008244]/10 dark:bg-[#008244]/25 text-[#006837] dark:text-[#79d2a8]",
  "Liga 3": "bg-[#0c2340]/10 dark:bg-[#79a1d2]/15 text-[#0c2340] dark:text-[#79a1d2]",
};

export function getLeagueColor(league: League): string {
  return LEAGUE_COLORS[league] ?? "#6B7280";
}

export function getLeagueTextColor(league: League): string {
  return LEAGUE_TEXT_COLORS[league] ?? "#44474c";
}

export function getLeagueTextColorDark(league: League): string {
  return LEAGUE_TEXT_COLORS_DARK[league] ?? "#D1D5DB";
}

export function filterClubs(
  clubs: Club[],
  league: FilterLeague,
  region: FilterRegion,
  query: string
): Club[] {
  return clubs.filter((c) => {
    const matchLeague = league === "all" || c.league === league;
    const matchRegion = region === "all" || c.region === region;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.abbr.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.nickname.toLowerCase().includes(q) ||
      c.supporters.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q);
    return matchLeague && matchRegion && matchQuery;
  });
}

export function getClubsByLeagueName(clubs: Club[], league: League): Club[] {
  return clubs.filter((c) => c.league === league);
}

export async function getAllClubs(): Promise<Club[]> {
  const { data, error } = await supabase.from("clubs").select("*");
  if (error) {
    throw new Error(`Gagal mengambil data klub dari Supabase: ${error.message}`);
  }
  return data as Club[];
}

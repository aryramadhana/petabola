import leaguesData from "@/data/leagues.json";
import type { LeagueGroup, LeagueInfo } from "@/types/league";
import type { League } from "@/types";

export function getAllLeagues(): LeagueInfo[] {
  return leaguesData as LeagueInfo[];
}

export function getLeagueById(id: string): LeagueInfo | undefined {
  return getAllLeagues().find((l) => l.id === id);
}

export function getLeagueGroups(leagueId: string): LeagueGroup[] {
  return getLeagueById(leagueId)?.groups ?? [];
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

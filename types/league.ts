import type { League } from "@/types";

export interface LeagueGroup {
  id: string;
  label: string;
}

export interface LeagueInfo {
  id: string;
  name: League;
  level: number;
  activeSeasonId: string;
  description: string;
  updatedAt: string;
  groups?: LeagueGroup[];
}

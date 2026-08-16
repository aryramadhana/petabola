export type MatchStatus = "scheduled" | "postponed" | "cancelled" | "finished";

export interface Match {
  id: string;
  seasonId: string;
  matchweek: number;
  homeClubId: string;
  awayClubId: string;
  date: string;
  time: string;
  timezone: string;
  stadium: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

export interface MatchesData {
  seasonId: string;
  updatedAt: string | null;
  matches: Match[];
}

export type MatchStatus = "scheduled" | "postponed" | "cancelled" | "finished";

export interface MatchGoal {
  clubId: string; // the club credited with the goal (opponent's id for an own goal)
  player: string;
  minute: number; // 45 / 90 for stoppage-time goals, with the extra in addedTime
  addedTime?: number;
  penalty?: boolean;
  ownGoal?: boolean;
}

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
  // Optional detail for finished matches. `attendance: 0` means played
  // behind closed doors; null/absent means no figure is available.
  goals?: MatchGoal[];
  attendance?: number | null;
}

export interface MatchesData {
  seasonId: string;
  updatedAt: string | null;
  matches: Match[];
}

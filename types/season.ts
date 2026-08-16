export type SeasonStatus = "upcoming" | "active" | "finished";

export interface Season {
  id: string;
  leagueId: string;
  name: string;
  status: SeasonStatus;
  startDate: string | null;
  endDate: string | null;
}

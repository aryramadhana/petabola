export interface StandingsRow {
  position: number;
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface StandingsData {
  seasonId: string;
  updatedAt: string | null;
  rows: StandingsRow[];
}

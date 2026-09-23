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

// A manual points correction applied on top of the computed table — league
// sanctions, licensing penalties and the like. Standings rows themselves are
// derived from match results now (see lib/standings-calc.ts), so this is the
// only part of a table that still has to be entered by hand.
export interface PointAdjustment {
  clubId: string;
  points: number; // signed: -2 for a two-point deduction
  reason: string;
}

export interface StandingsData {
  seasonId: string;
  updatedAt: string | null;
  adjustments: PointAdjustment[];
}

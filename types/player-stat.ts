export interface PlayerStat {
  id: string;
  name: string;
  clubId: string;
  goals: number;
  // null when unknown. The scoring chart is derived from match goal detail
  // (lib/player-stats-calc.ts), which records scorers only — filling this with
  // 0 there would claim every scorer has never assisted.
  assists: number | null;
}

export interface PlayerStatsData {
  seasonId: string;
  updatedAt: string | null;
  players: PlayerStat[];
}

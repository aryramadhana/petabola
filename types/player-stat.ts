export interface PlayerStat {
  id: string;
  name: string;
  clubId: string;
  goals: number;
  assists: number;
}

export interface PlayerStatsData {
  seasonId: string;
  updatedAt: string | null;
  players: PlayerStat[];
}

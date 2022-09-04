import { PlayerStats } from "./PlayerStats";

export type PlayerData = {
  name: string;
  description: string;
  health: number;
  score: number;
  stats: PlayerStats;
};

export interface FantasySettings {
  site: 'draftkings' | 'fanduel';
  lineups: number;
  maxExposure: number;
  budget: number;
  minSalary: number;
}

export interface FantasyLineup {
  id: string;
  players: string[];
  totalSalary: number;
  projectedPoints: number;
}

export interface FantasyPlayer {
  id: string;
  name: string;
  salary: number;
  projectedPoints: number;
  position: string;
  ownership?: number;
  actualPoints?: number;
  dfsEventId?: number;
}

export interface DFSEvent {
  calendar_year: number;
  date: string;
  event_id: number;
  event_name: string;
  tour: string;
  dk_ownerships: string;
  dk_salaries: string;
  fd_ownerships: string;
  fd_salaries: string;
}

export interface DFSPlayerData {
  bogey_free_pts: number;
  dg_id: number;
  fin_text: string;
  finish_pts: number;
  hole_in_one_pts: number;
  hole_score_pts: number;
  player_name: string;
  salary: number;
  ownership: number;
  streak_pts: number;
  sub_70_pts: number;
  total_pts: number;
}

export interface DFSEventData {
  tour: string;
  year: number;
  season: number;
  event_name: string;
  event_id: string;
  event_completed: string;
  ownerships_from: string;
  site: string;
  dfs_points: DFSPlayerData[];
}

export type DFSSite = 'draftkings' | 'fanduel';
export type DFSTour = 'pga' | 'euro';
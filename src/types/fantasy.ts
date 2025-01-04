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
}
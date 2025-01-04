export interface CourseAttributes {
  drivingDistance: number;
  drivingAccuracy: number;
  approach: number;
  aroundGreen: number;
  putting: number;
}

export interface CourseScoring {
  par3: number;
  par4: number;
  par5: number;
}

export interface Course {
  id: string;
  name: string;
  length: number;
  par: number;
  attributes: CourseAttributes;
  scoring: CourseScoring;
  stats: {
    fairwayWidth: number;
    greenSize: number;
    greenSpeed: number;
    avgScore: number;
  };
}

export interface PlayerStats {
  ott: number;
  app: number;
  putting: number;
}

export interface Player {
  id: string;
  name: string;
  imageUrl: string;
  rank: number;
  fit: number;
  stats: PlayerStats;
}
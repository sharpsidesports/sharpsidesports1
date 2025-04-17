export interface Player {
    id: string;
    name: string;
    imageUrl: string;
    rank: number;
    fit: number;
    stats: {
      total: number;
      ott: number;
      app: number;
      arg: number;
      putting: number;
    };
  }
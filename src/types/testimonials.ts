export interface TournamentWin {
  tournament: string;
  player: string;
  odds: string;
  year: number;
}

export interface FantasySuccess {
  tournamentName: string;
  entryFee: string;
  fieldSize: string;
  lineup: string[];
}

export interface Testimonial {
  name: string;
  quote: string;
  winAmount: string;
  platform: string;
  tournamentWins?: TournamentWin[];
  fantasySuccess?: FantasySuccess;
}
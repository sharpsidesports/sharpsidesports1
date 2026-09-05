// Shared types for the QB passing model. Reuses WarningReason/Confidence
// from the reception model unchanged (position-agnostic concepts); extends
// FallbackReason with one passing-model-specific reason rather than editing
// the reception model's shared type.

import type {
  FallbackReason as ReceptionFallbackReason,
  WarningReason,
  Confidence,
} from '../receptionModel/types.js';

export type FallbackReason = ReceptionFallbackReason | 'VEGAS_LINE_MISSING';
export type { WarningReason, Confidence };

export interface QbGameLog {
  season: number;
  week: number;
  team: string;
  opponentTeam: string | null;
  attempts: number;
  passingYards: number;
}

// TeamGameLog-compatible (same passAttempts/season/week/team/opponentTeam
// shape) plus the extra fields the passing model needs — structurally
// assignable wherever calculateProjectedTeamPassAttempts expects a
// TeamGameLog[], so it's reused unmodified.
export interface TeamPassingGameLog {
  season: number;
  week: number;
  team: string;
  opponentTeam: string | null;
  passAttempts: number;
  carries: number;
  passingYards: number;
}

export interface GameLineInput {
  spread: number | null; // this team's own spread, negative = favorite
  total: number | null; // game over/under
}

export interface QbModelInput {
  gsisId: string | null;
  espnId: string;
  playerName: string;
  team: string;
  opponentTeam: string | null;

  currentSeasonGames: QbGameLog[];
  priorSeasonGames: QbGameLog[];

  currentTeamGames: TeamPassingGameLog[];
  priorTeamGames: TeamPassingGameLog[];
  opponentGamesAllowed: TeamPassingGameLog[];

  gameLine: GameLineInput | null;

  espnProjectedAttempts: number | null;
  espnProjectedPassingYards: number | null;

  isRookie: boolean;
  isOnBye: boolean;
  injuryReportStatus: string | null;

  nflverseDataFetchedAt: string | null;
}

export interface PassingProjectionResult {
  gsisId: string | null;
  playerName: string;
  team: string;
  opponentTeam: string | null;

  espnProjectedAttempts: number | null;
  espnProjectedPassingYards: number | null;

  projectedTeamPassAttempts: number | null;
  expectedTotalPlays: number | null;
  expectedPassRate: number | null;
  expectedAttempts: number | null;
  attemptsOverExpected: number | null;

  expectedYardsPerAttempt: number | null;
  expectedPassingYards: number | null;
  projectedPassingYards: number | null;
  yardsOverExpected: number | null;

  vegasSpread: number | null;
  vegasTotal: number | null;

  dataSeason: number;
  dataWeek: number;
  dataLastUpdated: string | null;

  confidence: Confidence;
  fallbacksUsed: FallbackReason[];
  warnings: WarningReason[];

  skipped?: 'OUT' | 'BYE';
}

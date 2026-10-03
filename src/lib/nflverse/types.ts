// server-only helper — shared row types for nflverse-sourced data.

export interface NflversePlayerWeekRow {
  gsisId: string;
  playerName: string;
  position: string;
  team: string;
  opponentTeam: string;
  season: number;
  week: number;
  seasonType: string;
  gameId: string;
  targets: number;
  receptions: number;
  receivingYards: number;
  receivingTds: number;
  receivingAirYards: number;
  targetShare: number | null;
  airYardsShare: number | null;
  racr: number | null;
  rushingYards: number;
  rushingTds: number;
}

export interface NflverseTeamWeekRow {
  team: string;
  opponentTeam: string;
  season: number;
  week: number;
  seasonType: string;
  gameId: string;
  passAttempts: number;
  completions: number;
  passingYards: number;
  passingTds: number;
  passingInterceptions: number;
  sacksSuffered: number;
  passingAirYards: number;
  carries: number;
  rushingYards: number;
  rushingTds: number;
}

export interface NflverseQbWeekRow {
  gsisId: string;
  playerName: string;
  position: string;
  team: string;
  opponentTeam: string;
  season: number;
  week: number;
  seasonType: string;
  gameId: string;
  completions: number;
  attempts: number;
  passingYards: number;
  passingTds: number;
  passingInterceptions: number;
  sacksSuffered: number;
  sackYardsLost: number;
  passingAirYards: number;
  passingYardsAfterCatch: number;
  passingFirstDowns: number;
  passingEpa: number | null;
  passingCpoe: number | null;
  pacr: number | null;
  carries: number;
  rushingYards: number;
  rushingTds: number;
}

export interface NflverseGameLineRow {
  season: number;
  week: number;
  team: string;
  opponentTeam: string;
  isHome: boolean | null;
  spread: number | null;
  total: number | null;
  impliedTeamTotal: number | null;
  bookmaker: string;
}

export interface NflverseInjuryRow {
  gsisId: string | null;
  playerName: string;
  team: string;
  season: number;
  week: number;
  reportStatus: string | null;
  practiceStatus: string | null;
}

export interface NflverseScheduleRow {
  season: number;
  week: number;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  seasonType: string;
}

export interface PlayerCrosswalkRow {
  gsisId: string;
  espnId: string | null;
  pfrId: string | null;
  displayName: string;
  position: string;
  status: string | null;
  latestTeam: string | null;
}

// Stored/ingested shape (already joined to gsis_id at ingest time) — see
// src/lib/nflverse/snapCounts.ts for the raw pfr_player_id-keyed CSV shape.
export interface NflverseSnapCountRow {
  gsisId: string;
  season: number;
  week: number;
  team: string;
  offenseSnaps: number;
  offensePct: number | null;
}

// Stored/ingested shape — NGS's own CSV is already gsis_id-keyed, so this
// matches the raw shape directly (see src/lib/nflverse/ngsReceiving.ts).
export interface NflverseNgsReceivingRow {
  gsisId: string;
  season: number;
  week: number;
  avgCushion: number | null;
  avgSeparation: number | null;
  avgIntendedAirYards: number | null;
  catchPercentage: number | null;
  avgYac: number | null;
  avgExpectedYac: number | null;
  avgYacAboveExpectation: number | null;
}

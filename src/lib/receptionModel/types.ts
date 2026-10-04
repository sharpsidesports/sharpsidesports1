// Shared types for the WR reception projection model.

export interface PlayerGameLog {
  season: number;
  week: number;
  team: string;
  opponentTeam: string | null;
  targets: number;
  receptions: number;
  targetShare: number | null;
  receivingAirYards: number;
}

export interface TeamGameLog {
  season: number;
  week: number;
  team: string;
  opponentTeam: string | null;
  passAttempts: number;
  completions: number;
  passingTds: number;
  rushingTds: number;
}

export type FallbackReason =
  | 'ROOKIE_NO_HISTORY'
  | 'EARLY_SEASON_PRIOR_SEASON_REGRESSION'
  | 'TEAM_CHANGE_DISCOUNTED_HISTORY'
  | 'NFLVERSE_DATA_MISSING_ESPN_ONLY'
  | 'NFLVERSE_DATA_STALE'
  | 'NAME_MATCH_FALLBACK'
  | 'NO_PRIOR_SEASON_DATA';

export type WarningReason =
  | 'NFLVERSE_DATA_STALE'
  | 'QB_CHANGE_LOW_CONFIDENCE'
  | 'INJURY_QUESTIONABLE'
  | 'INJURY_DOUBTFUL'
  | 'UNMATCHED_PLAYER';

export type Confidence = 'high' | 'medium' | 'low';

// Per-player input assembled by the orchestrator from ingested nflverse +
// ESPN data before running it through the model's calculate* functions.
export interface PlayerModelInput {
  gsisId: string | null; // null if this ESPN player could not be matched to an nflverse ID at all
  espnId: string;
  playerName: string;
  team: string;
  position: string;
  opponentTeam: string | null;

  currentSeasonGames: PlayerGameLog[]; // this player, this season, ascending by week, actually-played games only
  priorSeasonGames: PlayerGameLog[]; // this player, most recent prior season

  currentTeamGames: TeamGameLog[]; // the player's current team, this season
  priorTeamGames: TeamGameLog[]; // the player's current team, prior season (for early-season projected pass attempts)
  opponentGamesAllowed: TeamGameLog[]; // upcoming opponent's games, any team they faced, current + prior season

  // Opponent's games allowed, filtered to what they've given up specifically
  // to WRs (not all positions lumped together) — see
  // calculateOpponentCatchRateAllowedByPosition.ts.
  opponentGamesAllowedToWr: { targets: number; receptions: number }[];

  currentSeasonSnapPct: { week: number; offenseSnapPct: number | null }[]; // this player, this season, ascending by week — offensive snap share (role proxy, not a literal routes-run count)
  latestNgsReceiving: {
    week: number;
    avgSeparation: number | null;
    avgCushion: number | null;
    avgYacAboveExpectation: number | null;
  } | null; // most recent available week's NGS row for this player, if any

  espnProjectedReceptions: number | null;

  impliedTeamTotal: number | null; // Vegas-consensus implied points for this player's team this week, null if lines aren't in yet
  seasonProjectedReceptions: { week: number; projectedReceptions: number }[]; // this player's persisted projections for season weeks < current week (Reception Debt input) — joined against currentSeasonGames by week, not summed blindly, so a bye/injury week with a stale persisted projection but no actual game doesn't skew the total

  isRookie: boolean;
  isTeamChangeThisSeason: boolean;
  qbChanged: boolean; // best-effort flag; V1 has no starter-tracking data source, always false unless passed in explicitly. Structured so a future QB-tracking source can set it.
  injuryReportStatus: string | null; // raw nflverse report_status: 'Out' | 'Doubtful' | 'Questionable' | null
  isOnBye: boolean;

  nflverseDataFetchedAt: string | null;
}

export interface ReceptionProjectionResult {
  gsisId: string | null;
  espnId: string;
  playerName: string;
  team: string;
  opponentTeam: string | null;

  espnProjectedReceptions: number | null;

  expectedTargetShare: number | null;
  projectedTeamPassAttempts: number | null;
  projectedTargets: number | null;
  expectedCatchRate: number | null;

  nflverseProjectedReceptions: number | null;

  finalProjectedReceptionsRaw: number | null;
  projectedReceptions: number | null;

  receptionEdgeScore: number | null;

  projectionDifference: number | null;

  impliedTeamTotal: number | null;
  opponentTdRateAllowed: number | null; // opponent's rushing + passing TDs allowed per game
  opponentCatchPctAllowed: number | null; // opponent's completions / pass attempts allowed per game, ALL positions (team-wide) — kept for Sharp Score, which is unchanged
  opponentCatchPctAllowedToWr: number | null; // same idea, but specifically what the opponent has allowed to WRs — more accurate for this WR-only page; display-only, not a Sharp Score input
  targetsPerGame: number | null; // season-to-date
  catchPctSeason: number | null; // season-to-date receptions / targets
  receptionDebt: number | null; // season-to-date projected minus actual receptions; positive = "due"
  sharpScore: number | null; // composite 0-100 score across ESPN/volume/target-share/matchup/debt signals

  // Recent-games (last up to 3) raw observed rollups — see calculateRecentRollups.ts.
  // Not blended/shrunk like expectedTargetShare/expectedCatchRate, and not diluted
  // by the whole season like receptionDebt/catchPctSeason — used to flag a
  // player's current role/efficiency and detect a role trend.
  recentTargetShare: number | null;
  recentCatchPct: number | null;
  seasonTargetShareActual: number | null;
  recentGamesCount: number;
  recentTargets: number;

  // Target share over the last 2 games specifically — used for the Role
  // Climbing/Fading trend, a shorter/more reactive window than recentTargetShare.
  roleTrendTargetShare: number | null;
  roleTrendGamesCount: number;

  // Snap share (role proxy) — same last-up-to-3-game recency window as
  // recentTargetShare. Display-only; not a Sharp Score input.
  recentOffenseSnapPct: number | null;

  // NGS receiving quality signals — most recent available week, display-only.
  avgSeparation: number | null;
  avgCushion: number | null;
  avgYacAboveExpectation: number | null;

  // Team-level neutral-script pass rate over expected (PROE) trend — see
  // calculateTeamPassRateTrend.ts. Display-only, not a Sharp Score input.
  recentTeamProe: number | null;
  seasonTeamProe: number | null;

  dataSeason: number;
  dataWeek: number;
  dataLastUpdated: string | null;

  confidence: Confidence;
  fallbacksUsed: FallbackReason[];
  warnings: WarningReason[];

  skipped?: 'OUT' | 'BYE';
}

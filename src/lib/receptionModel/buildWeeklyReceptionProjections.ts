// Orchestrator: assembles per-player inputs from already-fetched ESPN +
// nflverse data and runs them through the full Part 1 / Part 2 pipeline,
// applying every edge case from the spec. Pure function — no I/O, no
// Supabase — so it's directly testable against real fetched data without a
// database, and reusable identically by the live API route and the
// backtest script. Persistence is a separate step (persistReceptionProjections.ts).

import type { EspnPlayerReceptionProjection } from '../espnProjections.js';
import type {
  NflversePlayerWeekRow,
  NflverseTeamWeekRow,
  NflverseGameLineRow,
  NflverseInjuryRow,
  NflverseScheduleRow,
  PlayerCrosswalkRow,
  NflverseSnapCountRow,
  NflverseNgsReceivingRow,
} from '../nflverse/types.js';
import { toNflverseTeamCode } from '../nflverse/teamCodes.js';
import { buildEspnToGsisMap, buildNormalizedNameMap, normalizePlayerName } from '../nflverse/playerCrosswalk.js';
import { calculateEspnProjection } from './calculateEspnProjection.js';
import { calculateExpectedTargetShare } from './calculateExpectedTargetShare.js';
import { calculateExpectedCatchRate } from './calculateExpectedCatchRate.js';
import { calculateProjectedTeamPassAttempts } from './calculateProjectedTeamPassAttempts.js';
import { calculateProjectedTargets } from './calculateProjectedTargets.js';
import { calculateNFLVerseReceptions } from './calculateNFLVerseReceptions.js';
import { calculateProjectedReceptions } from './calculateProjectedReceptions.js';
import { calculateReceptionEdgeScore } from './calculateReceptionEdgeScore.js';
import { calculateSharpScore } from './calculateSharpScore.js';
import { calculateMatchupTdRateAllowed } from './calculateMatchupTdRateAllowed.js';
import { calculateOpponentCatchRateAllowed } from './calculateOpponentCatchRateAllowed.js';
import { calculateOpponentCatchRateAllowedByPosition } from './calculateOpponentCatchRateAllowedByPosition.js';
import { calculateSeasonRollups } from './calculateSeasonRollups.js';
import { calculateReceptionDebt } from './calculateReceptionDebt.js';
import { calculateRecentRollups, calculateTargetShareWindow } from './calculateRecentRollups.js';
import { calculateTeamPassRateTrend } from './calculateTeamPassRateTrend.js';
import type { NflverseTeamPassRateRow } from '../nflverse/pbp.js';

// Role Climbing/Fading compares a shorter, more reactive window (last 2
// games) against the season average, separate from the 3-game window used
// for the main recent target-share/catch-rate rollups above.
const ROLE_TREND_WINDOW = 2;
import { calculateProjectionDifference } from './calculateProjectionDifference.js';
import { checkNFLVerseFreshness } from './checkNFLVerseFreshness.js';
import type {
  PlayerGameLog,
  TeamGameLog,
  PlayerModelInput,
  ReceptionProjectionResult,
  FallbackReason,
  WarningReason,
  Confidence,
} from './types.js';

export interface BuildProjectionsInput {
  season: number;
  week: number;
  priorSeason: number;
  espnProjections: EspnPlayerReceptionProjection[];
  playerWeekStats: NflversePlayerWeekRow[]; // current + prior season, WR only
  teamWeekStats: NflverseTeamWeekRow[]; // current + prior season, all teams
  injuries: NflverseInjuryRow[]; // current season
  schedule: NflverseScheduleRow[]; // current season, used for cross-check only (ESPN's own opponent/BYE tag is primary)
  crosswalk: PlayerCrosswalkRow[];
  gameLines: NflverseGameLineRow[]; // current week only, consensus rows (Implied Team Total)
  receptionProjectionHistory: { gsisId: string; week: number; projectedReceptions: number }[]; // this season, weeks < current week, persisted reception_projections (Reception Debt input)
  snapCounts: NflverseSnapCountRow[]; // current season, this player's offensive snap share by week
  ngsReceiving: NflverseNgsReceivingRow[]; // current season, this player's NGS receiving rows by week
  teamPassRateStats: NflverseTeamPassRateRow[]; // current season, every team's neutral-script pass rate by week
  nflverseFetchedAt: string | null;
  latestAvailableNflverseWeek: { season: number; week: number } | null;
}

// ONE-OFF TARGET SHARE OVERRIDES — manual percentage-point bumps per
// request, scoped to a single (season, week, player). Each entry only
// applies to the exact week it names, so old entries go inert on their own
// once that week passes rather than needing to be deleted.
const TARGET_SHARE_OVERRIDES: { season: number; week: number; gsisId: string; delta: number; note: string }[] = [
  { season: 2026, week: 2, gsisId: '00-0036963', delta: 0.1, note: 'Amon-Ra St. Brown' },
  { season: 2026, week: 2, gsisId: '00-0036900', delta: 0.1, note: "Ja'Marr Chase" },
  { season: 2026, week: 2, gsisId: '00-0036358', delta: 0.1, note: 'CeeDee Lamb' },
  { season: 2026, week: 2, gsisId: '00-0039915', delta: 0.1, note: 'Ladd McConkey' },
  { season: 2026, week: 2, gsisId: '00-0038606', delta: 0.1, note: 'Parker Washington' },
  { season: 2026, week: 4, gsisId: '00-0041037', delta: 0.1, note: 'Denzel Boston' },
];

function round(n: number | null, decimals: number): number | null {
  if (n === null) return null;
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

// Same last-up-to-3-game recency window as calculateRecentRollups, applied to
// snap share — kept as a tiny inline helper rather than a new shared function
// since this is its only use site.
function recentAverage(values: (number | null)[], window = 3): number | null {
  const recent = values.slice(-window).filter((v): v is number => v !== null);
  if (recent.length === 0) return null;
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

function toPlayerGameLog(r: NflversePlayerWeekRow): PlayerGameLog {
  return {
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponentTeam || null,
    targets: r.targets,
    receptions: r.receptions,
    targetShare: r.targetShare,
    receivingAirYards: r.receivingAirYards,
  };
}

function toTeamGameLog(r: NflverseTeamWeekRow): TeamGameLog {
  return {
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponentTeam || null,
    passAttempts: r.passAttempts,
    completions: r.completions,
    passingTds: r.passingTds,
    rushingTds: r.rushingTds,
  };
}

export function buildWeeklyReceptionProjections(input: BuildProjectionsInput): ReceptionProjectionResult[] {
  const espnToGsis = buildEspnToGsisMap(input.crosswalk);
  const nameMap = buildNormalizedNameMap(input.crosswalk);
  const espnByEspnId = new Map(input.espnProjections.map((p) => [p.espn_id, p]));

  const freshness = checkNFLVerseFreshness(
    { season: input.season, week: input.week },
    input.nflverseFetchedAt && input.latestAvailableNflverseWeek
      ? { ...input.latestAvailableNflverseWeek, fetchedAt: input.nflverseFetchedAt }
      : null
  );

  const wrPlayers = input.espnProjections.filter((p) => p.position === 'WR');

  const assembled: { model: PlayerModelInput; unmatched: boolean }[] = [];

  for (const espnPlayer of wrPlayers) {
    const team = toNflverseTeamCode(espnPlayer.team);
    const isOnBye = espnPlayer.opponent === 'BYE';
    const opponentTeam = isOnBye || espnPlayer.opponent === 'TBD' ? null : toNflverseTeamCode(espnPlayer.opponent);

    let gsisId = espnToGsis.get(espnPlayer.espn_id) ?? null;
    let unmatched = false;
    if (!gsisId) {
      // Fallback: normalized-name match, disambiguated by team when the name
      // isn't unique on its own (e.g. two "Mike Williams" in the league).
      const candidates = nameMap.get(normalizePlayerName(espnPlayer.player_name)) ?? [];
      const sameTeam = candidates.filter((c) => c.latestTeam === team);
      const match = sameTeam.length === 1 ? sameTeam[0] : candidates.length === 1 ? candidates[0] : null;
      if (match) {
        gsisId = match.gsisId;
      } else {
        unmatched = true; // no confident match: 0 candidates, or an unresolved ambiguity
      }
    }

    const currentSeasonGames = gsisId
      ? input.playerWeekStats
          .filter((r) => r.gsisId === gsisId && r.season === input.season && r.week < input.week)
          .sort((a, b) => a.week - b.week)
          .map(toPlayerGameLog)
      : [];
    const priorSeasonGames = gsisId
      ? input.playerWeekStats
          .filter((r) => r.gsisId === gsisId && r.season === input.priorSeason)
          .sort((a, b) => a.week - b.week)
          .map(toPlayerGameLog)
      : [];

    const isRookie = currentSeasonGames.length === 0 && priorSeasonGames.length === 0;

    const lastPriorTeam = priorSeasonGames.length > 0 ? priorSeasonGames[priorSeasonGames.length - 1].team : null;
    const isTeamChangeThisSeason = lastPriorTeam !== null && lastPriorTeam !== team;

    const currentTeamGames = input.teamWeekStats
      .filter((r) => r.team === team && r.season === input.season && r.week < input.week)
      .sort((a, b) => a.week - b.week)
      .map(toTeamGameLog);
    const priorTeamGames = input.teamWeekStats
      .filter((r) => r.team === team && r.season === input.priorSeason)
      .sort((a, b) => a.week - b.week)
      .map(toTeamGameLog);
    const opponentGamesAllowed = opponentTeam
      ? input.teamWeekStats
          .filter(
            (r) =>
              r.opponentTeam === opponentTeam &&
              (r.season === input.season || r.season === input.priorSeason)
          )
          .map(toTeamGameLog)
      : [];

    // Same idea as opponentGamesAllowed above, but summed per-game across just
    // the WRs who played that game — input.playerWeekStats already carries
    // every non-QB position leaguewide, so this is a filter over data already
    // loaded, not a new fetch. Grouped by (season, week) since a defense faces
    // only one offense per week.
    const opponentGamesAllowedToWr: { targets: number; receptions: number }[] = opponentTeam
      ? Array.from(
          input.playerWeekStats
            .filter(
              (r) =>
                r.opponentTeam === opponentTeam &&
                r.position === 'WR' &&
                (r.season === input.season || r.season === input.priorSeason)
            )
            .reduce((acc, r) => {
              const key = `${r.season}-${r.week}`;
              const existing = acc.get(key) ?? { targets: 0, receptions: 0 };
              existing.targets += r.targets;
              existing.receptions += r.receptions;
              acc.set(key, existing);
              return acc;
            }, new Map<string, { targets: number; receptions: number }>())
            .values()
        )
      : [];

    const injury = gsisId
      ? input.injuries.find((i) => i.gsisId === gsisId && i.season === input.season && i.week === input.week)
      : undefined;

    const impliedTeamTotal =
      input.gameLines.find((g) => g.team === team && g.season === input.season && g.week === input.week)
        ?.impliedTeamTotal ?? null;
    const seasonProjectedReceptions = gsisId
      ? input.receptionProjectionHistory
          .filter((r) => r.gsisId === gsisId && r.week < input.week)
          .map((r) => ({ week: r.week, projectedReceptions: r.projectedReceptions }))
      : [];

    const currentSeasonSnapPct = gsisId
      ? input.snapCounts
          .filter((r) => r.gsisId === gsisId && r.season === input.season && r.week < input.week)
          .sort((a, b) => a.week - b.week)
          .map((r) => ({ week: r.week, offenseSnapPct: r.offensePct }))
      : [];

    const latestNgsReceiving = gsisId
      ? (input.ngsReceiving
          .filter((r) => r.gsisId === gsisId && r.season === input.season && r.week < input.week)
          .sort((a, b) => b.week - a.week)[0] ?? null)
      : null;

    const model: PlayerModelInput = {
      gsisId,
      espnId: espnPlayer.espn_id,
      playerName: espnPlayer.player_name,
      team,
      position: espnPlayer.position,
      opponentTeam,
      currentSeasonGames,
      priorSeasonGames,
      currentTeamGames,
      priorTeamGames,
      opponentGamesAllowed,
      opponentGamesAllowedToWr,
      currentSeasonSnapPct,
      latestNgsReceiving: latestNgsReceiving
        ? {
            week: latestNgsReceiving.week,
            avgSeparation: latestNgsReceiving.avgSeparation,
            avgCushion: latestNgsReceiving.avgCushion,
            avgYacAboveExpectation: latestNgsReceiving.avgYacAboveExpectation,
          }
        : null,
      espnProjectedReceptions: calculateEspnProjection(espnPlayer.espn_id, espnByEspnId),
      impliedTeamTotal,
      seasonProjectedReceptions,
      isRookie,
      isTeamChangeThisSeason,
      qbChanged: false, // V1: no starter-tracking data source yet; hook for a future adjustment
      injuryReportStatus: injury?.reportStatus ?? null,
      isOnBye,
      nflverseDataFetchedAt: input.nflverseFetchedAt,
    };

    assembled.push({ model, unmatched });
  }

  // Separate out players we should not generate a normal projection for
  // (OUT, bye) — still returned so the frontend/backtest can see them, just
  // with no numeric projection.
  const skippedResults: ReceptionProjectionResult[] = [];
  const active: { model: PlayerModelInput; unmatched: boolean }[] = [];

  for (const entry of assembled) {
    const { model } = entry;
    if (model.isOnBye) {
      skippedResults.push(baseResult(model, input, 'BYE', freshness.warnings));
      continue;
    }
    if (model.injuryReportStatus === 'Out') {
      skippedResults.push(baseResult(model, input, 'OUT', freshness.warnings));
      continue;
    }
    active.push(entry);
  }

  // Run Part 1 for every active player first (Edge Score needs the whole pool).
  const perPlayer = active.map(({ model, unmatched }) => {
    const targetShare = calculateExpectedTargetShare(model);
    if (targetShare.value !== null) {
      const override = TARGET_SHARE_OVERRIDES.find(
        (o) => o.season === input.season && o.week === input.week && o.gsisId === model.gsisId
      );
      if (override) targetShare.value += override.delta;
    }
    const catchRate = calculateExpectedCatchRate(model);
    const passAttempts = calculateProjectedTeamPassAttempts(
      model.currentTeamGames,
      model.priorTeamGames,
      model.opponentGamesAllowed
    );
    const projectedTargets = calculateProjectedTargets(passAttempts.projectedTeamPassAttempts, targetShare.value);
    const nflverseReceptions = calculateNFLVerseReceptions(projectedTargets, catchRate.expectedCatchRate);
    const blend = calculateProjectedReceptions(model.espnProjectedReceptions, nflverseReceptions);
    const projectionDifference = calculateProjectionDifference(
      blend.finalProjectedReceptionsRaw,
      model.espnProjectedReceptions
    );

    const fallbacksUsed = dedupe([
      ...targetShare.fallbacksUsed,
      ...catchRate.fallbacksUsed,
      ...passAttempts.fallbacksUsed,
      ...blend.fallbacksUsed,
    ]);

    const warnings = dedupe<WarningReason>([
      ...freshness.warnings,
      ...(model.qbChanged ? (['QB_CHANGE_LOW_CONFIDENCE'] as WarningReason[]) : []),
      ...(model.injuryReportStatus === 'Questionable' ? (['INJURY_QUESTIONABLE'] as WarningReason[]) : []),
      ...(model.injuryReportStatus === 'Doubtful' ? (['INJURY_DOUBTFUL'] as WarningReason[]) : []),
      ...(unmatched ? (['UNMATCHED_PLAYER'] as WarningReason[]) : []),
    ]);

    const confidence = deriveConfidence(model, fallbacksUsed, warnings, unmatched);

    const opponentTdRateAllowed = calculateMatchupTdRateAllowed(model.opponentGamesAllowed);
    const opponentCatchPctAllowed = calculateOpponentCatchRateAllowed(model.opponentGamesAllowed);
    const opponentCatchPctAllowedToWr = calculateOpponentCatchRateAllowedByPosition(model.opponentGamesAllowedToWr);
    const seasonRollups = calculateSeasonRollups(model.currentSeasonGames);
    const receptionDebt = calculateReceptionDebt(model.seasonProjectedReceptions, model.currentSeasonGames);
    const recentRollups = calculateRecentRollups(model.currentSeasonGames);
    const roleTrendWindow = calculateTargetShareWindow(model.currentSeasonGames, ROLE_TREND_WINDOW);
    const recentOffenseSnapPct = recentAverage(model.currentSeasonSnapPct.map((g) => g.offenseSnapPct));

    const teamWeeks = input.teamPassRateStats
      .filter((r) => r.team === model.team && r.week < input.week)
      .map((r) => ({ week: r.week, neutralPlays: r.neutralPlays, passOeSum: r.passOeSum }));
    const teamPassRateTrend = calculateTeamPassRateTrend(teamWeeks);

    return {
      model,
      targetShare,
      catchRate,
      passAttempts,
      projectedTargets,
      nflverseReceptions,
      blend,
      projectionDifference,
      fallbacksUsed,
      warnings,
      confidence,
      opponentTdRateAllowed,
      opponentCatchPctAllowed,
      opponentCatchPctAllowedToWr,
      seasonRollups,
      receptionDebt,
      recentRollups,
      roleTrendWindow,
      recentOffenseSnapPct,
      teamPassRateTrend,
    };
  });

  const edgeScores = calculateReceptionEdgeScore(
    perPlayer.map((p) => ({
      espnProjectedReceptions: p.model.espnProjectedReceptions,
      targetVolume: p.projectedTargets,
      expectedTargetShare: p.targetShare.value,
    }))
  );

  const sharpScores = calculateSharpScore(
    perPlayer.map((p) => ({
      espnProjectedReceptions: p.model.espnProjectedReceptions,
      targetVolume: p.projectedTargets,
      expectedTargetShare: p.targetShare.value,
      impliedTeamTotal: p.model.impliedTeamTotal,
      opponentCatchPctAllowed: p.opponentCatchPctAllowed,
      receptionDebt: p.receptionDebt,
    }))
  );

  const results: ReceptionProjectionResult[] = perPlayer.map((p, i) => ({
    gsisId: p.model.gsisId,
    espnId: p.model.espnId,
    playerName: p.model.playerName,
    team: p.model.team,
    opponentTeam: p.model.opponentTeam,
    espnProjectedReceptions: round(p.model.espnProjectedReceptions, 2),
    expectedTargetShare: round(p.targetShare.value, 3),
    projectedTeamPassAttempts: round(p.passAttempts.projectedTeamPassAttempts, 1),
    projectedTargets: round(p.projectedTargets, 2),
    expectedCatchRate: round(p.catchRate.expectedCatchRate, 3),
    nflverseProjectedReceptions: round(p.nflverseReceptions, 2),
    finalProjectedReceptionsRaw: round(p.blend.finalProjectedReceptionsRaw, 2),
    projectedReceptions: p.blend.projectedReceptions,
    receptionEdgeScore: edgeScores[i],
    projectionDifference: p.projectionDifference,
    impliedTeamTotal: round(p.model.impliedTeamTotal, 1),
    opponentTdRateAllowed: round(p.opponentTdRateAllowed, 2),
    opponentCatchPctAllowed: round(p.opponentCatchPctAllowed, 3),
    opponentCatchPctAllowedToWr: round(p.opponentCatchPctAllowedToWr, 3),
    targetsPerGame: round(p.seasonRollups.targetsPerGame, 2),
    catchPctSeason: round(p.seasonRollups.catchPctSeason, 3),
    receptionDebt: round(p.receptionDebt, 2),
    sharpScore: sharpScores[i],
    recentTargetShare: round(p.recentRollups.recentTargetShare, 3),
    recentCatchPct: round(p.recentRollups.recentCatchPct, 3),
    seasonTargetShareActual: round(p.recentRollups.seasonTargetShareActual, 3),
    recentGamesCount: p.recentRollups.recentGamesCount,
    recentTargets: p.recentRollups.recentTargets,
    roleTrendTargetShare: round(p.roleTrendWindow.targetShare, 3),
    roleTrendGamesCount: p.roleTrendWindow.gamesCount,
    recentOffenseSnapPct: round(p.recentOffenseSnapPct, 3),
    avgSeparation: round(p.model.latestNgsReceiving?.avgSeparation ?? null, 2),
    avgCushion: round(p.model.latestNgsReceiving?.avgCushion ?? null, 2),
    avgYacAboveExpectation: round(p.model.latestNgsReceiving?.avgYacAboveExpectation ?? null, 2),
    recentTeamProe: round(p.teamPassRateTrend.recentProe, 3),
    seasonTeamProe: round(p.teamPassRateTrend.seasonProe, 3),
    dataSeason: input.season,
    dataWeek: input.week,
    dataLastUpdated: input.nflverseFetchedAt,
    confidence: p.confidence,
    fallbacksUsed: p.fallbacksUsed,
    warnings: p.warnings,
  }));

  return [...results, ...skippedResults];
}

function baseResult(
  model: PlayerModelInput,
  input: BuildProjectionsInput,
  skipped: 'OUT' | 'BYE',
  freshnessWarnings: WarningReason[]
): ReceptionProjectionResult {
  return {
    gsisId: model.gsisId,
    espnId: model.espnId,
    playerName: model.playerName,
    team: model.team,
    opponentTeam: model.opponentTeam,
    espnProjectedReceptions: round(model.espnProjectedReceptions, 2),
    expectedTargetShare: null,
    projectedTeamPassAttempts: null,
    projectedTargets: null,
    expectedCatchRate: null,
    nflverseProjectedReceptions: null,
    finalProjectedReceptionsRaw: null,
    projectedReceptions: null,
    receptionEdgeScore: null,
    projectionDifference: null,
    impliedTeamTotal: null,
    opponentTdRateAllowed: null,
    opponentCatchPctAllowed: null,
    opponentCatchPctAllowedToWr: null,
    targetsPerGame: null,
    catchPctSeason: null,
    receptionDebt: null,
    sharpScore: null,
    recentTargetShare: null,
    recentCatchPct: null,
    seasonTargetShareActual: null,
    recentGamesCount: 0,
    recentTargets: 0,
    roleTrendTargetShare: null,
    roleTrendGamesCount: 0,
    recentOffenseSnapPct: null,
    avgSeparation: null,
    avgCushion: null,
    avgYacAboveExpectation: null,
    recentTeamProe: null,
    seasonTeamProe: null,
    dataSeason: input.season,
    dataWeek: input.week,
    dataLastUpdated: input.nflverseFetchedAt,
    confidence: 'low',
    fallbacksUsed: [],
    warnings: freshnessWarnings,
    skipped,
  };
}

function deriveConfidence(
  model: PlayerModelInput,
  fallbacksUsed: FallbackReason[],
  warnings: WarningReason[],
  unmatched: boolean
): Confidence {
  if (model.isRookie || !model.gsisId || unmatched) return 'low';
  const mediumTriggers: (FallbackReason | WarningReason)[] = [
    'EARLY_SEASON_PRIOR_SEASON_REGRESSION',
    'TEAM_CHANGE_DISCOUNTED_HISTORY',
    'NFLVERSE_DATA_MISSING_ESPN_ONLY',
    'NFLVERSE_DATA_STALE',
    'QB_CHANGE_LOW_CONFIDENCE',
    'INJURY_QUESTIONABLE',
    'INJURY_DOUBTFUL',
  ];
  const hasMedium = [...fallbacksUsed, ...warnings].some((r) => mediumTriggers.includes(r));
  return hasMedium ? 'medium' : 'high';
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

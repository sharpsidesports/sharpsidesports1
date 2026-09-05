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
  NflverseInjuryRow,
  NflverseScheduleRow,
  PlayerCrosswalkRow,
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
  nflverseFetchedAt: string | null;
  latestAvailableNflverseWeek: { season: number; week: number } | null;
}

function round(n: number | null, decimals: number): number | null {
  if (n === null) return null;
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
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

    const injury = gsisId
      ? input.injuries.find((i) => i.gsisId === gsisId && i.season === input.season && i.week === input.week)
      : undefined;

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
      espnProjectedReceptions: calculateEspnProjection(espnPlayer.espn_id, espnByEspnId),
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

    return { model, targetShare, catchRate, passAttempts, projectedTargets, nflverseReceptions, blend, projectionDifference, fallbacksUsed, warnings, confidence };
  });

  const edgeScores = calculateReceptionEdgeScore(
    perPlayer.map((p) => ({
      espnProjectedReceptions: p.model.espnProjectedReceptions,
      targetVolume: p.projectedTargets,
      expectedTargetShare: p.targetShare.value,
    }))
  );

  const results: ReceptionProjectionResult[] = perPlayer.map((p, i) => ({
    gsisId: p.model.gsisId,
    playerName: p.model.playerName,
    team: p.model.team,
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
    playerName: model.playerName,
    team: model.team,
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

// Orchestrator: assembles per-QB inputs from already-fetched ESPN + nflverse
// + Vegas-line data and runs them through the full Attempts/Yards Over
// Expected pipeline. Pure function — no I/O, no Supabase — mirrors
// receptionModel/buildWeeklyReceptionProjections.ts's structure exactly.

import type { EspnQbPassingProjection } from '../espnProjections.js';
import type {
  NflverseQbWeekRow,
  NflverseTeamWeekRow,
  NflverseGameLineRow,
  PlayerCrosswalkRow,
} from '../nflverse/types.js';
import { toNflverseTeamCode } from '../nflverse/teamCodes.js';
import { buildEspnToGsisMap, buildNormalizedNameMap, normalizePlayerName } from '../nflverse/playerCrosswalk.js';
import { calculateProjectedTeamPassAttempts } from '../receptionModel/calculateProjectedTeamPassAttempts.js';
import { checkNFLVerseFreshness } from '../receptionModel/checkNFLVerseFreshness.js';
import { calculateEspnPassingProjection } from './calculateEspnPassingProjection.js';
import { calculateExpectedTotalPlays } from './calculateExpectedTotalPlays.js';
import { calculateExpectedPassRate } from './calculateExpectedPassRate.js';
import { calculateExpectedAttempts } from './calculateExpectedAttempts.js';
import { calculateAttemptsOverExpected } from './calculateAttemptsOverExpected.js';
import { calculateExpectedYardsPerAttempt } from './calculateExpectedYardsPerAttempt.js';
import { calculateExpectedPassingYards } from './calculateExpectedPassingYards.js';
import { calculateProjectedPassingYards } from './calculateProjectedPassingYards.js';
import { calculateYardsOverExpected } from './calculateYardsOverExpected.js';
import type {
  QbGameLog,
  TeamPassingGameLog,
  GameLineInput,
  QbModelInput,
  PassingProjectionResult,
  FallbackReason,
  WarningReason,
  Confidence,
} from './types.js';

export interface BuildPassingProjectionsInput {
  season: number;
  week: number;
  priorSeason: number;
  espnProjections: EspnQbPassingProjection[];
  qbWeekStats: NflverseQbWeekRow[]; // current + prior season, QB only
  teamWeekStats: NflverseTeamWeekRow[]; // current + prior season, all teams, widened w/ passing+rushing cols
  gameLines: NflverseGameLineRow[]; // current week only, consensus rows
  crosswalk: PlayerCrosswalkRow[];
  nflverseFetchedAt: string | null;
  latestAvailableNflverseWeek: { season: number; week: number } | null;
}

function round(n: number | null, decimals: number): number | null {
  if (n === null) return null;
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

function toQbGameLog(r: NflverseQbWeekRow): QbGameLog {
  return {
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponentTeam || null,
    attempts: r.attempts,
    passingYards: r.passingYards,
  };
}

function toTeamPassingGameLog(r: NflverseTeamWeekRow): TeamPassingGameLog {
  return {
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponentTeam || null,
    passAttempts: r.passAttempts,
    carries: r.carries,
    passingYards: r.passingYards,
  };
}

export function buildWeeklyPassingProjections(input: BuildPassingProjectionsInput): PassingProjectionResult[] {
  const espnToGsis = buildEspnToGsisMap(input.crosswalk);
  const nameMap = buildNormalizedNameMap(input.crosswalk);
  const espnByEspnId = new Map(input.espnProjections.map((p) => [p.espn_id, p]));

  const freshness = checkNFLVerseFreshness(
    { season: input.season, week: input.week },
    input.nflverseFetchedAt && input.latestAvailableNflverseWeek
      ? { ...input.latestAvailableNflverseWeek, fetchedAt: input.nflverseFetchedAt }
      : null
  );

  // ESPN's projection feed includes a backup QB for every team with a
  // negligible placeholder projection (~1.2-1.5 attempts, seen live for
  // every single team) alongside the real starter — keep only the
  // highest-projected-attempts QB per team so each team shows once.
  const starterByTeam = new Map<string, EspnQbPassingProjection>();
  for (const p of input.espnProjections) {
    const existing = starterByTeam.get(p.team);
    if (!existing || p.projectedAttempts > existing.projectedAttempts) {
      starterByTeam.set(p.team, p);
    }
  }
  const starters = [...starterByTeam.values()];

  const assembled: { model: QbModelInput; unmatched: boolean }[] = [];

  for (const espnPlayer of starters) {
    const team = toNflverseTeamCode(espnPlayer.team);
    const isOnBye = espnPlayer.opponent === 'BYE';
    const opponentTeam = isOnBye || espnPlayer.opponent === 'TBD' ? null : toNflverseTeamCode(espnPlayer.opponent);

    let gsisId = espnToGsis.get(espnPlayer.espn_id) ?? null;
    let unmatched = false;
    if (!gsisId) {
      const candidates = nameMap.get(normalizePlayerName(espnPlayer.player_name)) ?? [];
      const sameTeam = candidates.filter((c) => c.latestTeam === team);
      const match = sameTeam.length === 1 ? sameTeam[0] : candidates.length === 1 ? candidates[0] : null;
      if (match) {
        gsisId = match.gsisId;
      } else {
        unmatched = true;
      }
    }

    const currentSeasonGames = gsisId
      ? input.qbWeekStats
          .filter((r) => r.gsisId === gsisId && r.season === input.season && r.week < input.week)
          .sort((a, b) => a.week - b.week)
          .map(toQbGameLog)
      : [];
    const priorSeasonGames = gsisId
      ? input.qbWeekStats
          .filter((r) => r.gsisId === gsisId && r.season === input.priorSeason)
          .sort((a, b) => a.week - b.week)
          .map(toQbGameLog)
      : [];

    const isRookie = currentSeasonGames.length === 0 && priorSeasonGames.length === 0;

    const currentTeamGames = input.teamWeekStats
      .filter((r) => r.team === team && r.season === input.season && r.week < input.week)
      .sort((a, b) => a.week - b.week)
      .map(toTeamPassingGameLog);
    const priorTeamGames = input.teamWeekStats
      .filter((r) => r.team === team && r.season === input.priorSeason)
      .sort((a, b) => a.week - b.week)
      .map(toTeamPassingGameLog);
    const opponentGamesAllowed = opponentTeam
      ? input.teamWeekStats
          .filter(
            (r) =>
              r.opponentTeam === opponentTeam &&
              (r.season === input.season || r.season === input.priorSeason)
          )
          .map(toTeamPassingGameLog)
      : [];

    const lineRow = input.gameLines.find(
      (l) => l.team === team && l.season === input.season && l.week === input.week
    );
    const gameLine: GameLineInput | null = lineRow ? { spread: lineRow.spread, total: lineRow.total } : null;

    const espnLookup = calculateEspnPassingProjection(espnPlayer.espn_id, espnByEspnId);

    const model: QbModelInput = {
      gsisId,
      espnId: espnPlayer.espn_id,
      playerName: espnPlayer.player_name,
      team,
      opponentTeam,
      currentSeasonGames,
      priorSeasonGames,
      currentTeamGames,
      priorTeamGames,
      opponentGamesAllowed,
      gameLine,
      espnProjectedAttempts: espnLookup.projectedAttempts,
      espnProjectedPassingYards: espnLookup.projectedPassingYards,
      isRookie,
      isOnBye,
      injuryReportStatus: null, // V1: no QB-specific injury wiring yet, same "hook for later" stance as qbChanged in the reception model
      nflverseDataFetchedAt: input.nflverseFetchedAt,
    };

    assembled.push({ model, unmatched });
  }

  const skippedResults: PassingProjectionResult[] = [];
  const active: { model: QbModelInput; unmatched: boolean }[] = [];

  for (const entry of assembled) {
    const { model } = entry;
    if (model.isOnBye) {
      skippedResults.push(baseResult(model, input, 'BYE', freshness.warnings));
      continue;
    }
    active.push(entry);
  }

  const results: PassingProjectionResult[] = active.map(({ model, unmatched }) => {
    const passAttempts = calculateProjectedTeamPassAttempts(
      model.currentTeamGames,
      model.priorTeamGames,
      model.opponentGamesAllowed
    );
    const totalPlays = calculateExpectedTotalPlays(
      model.currentTeamGames,
      model.priorTeamGames,
      model.opponentGamesAllowed,
      model.gameLine
    );
    const passRate = calculateExpectedPassRate(model.opponentGamesAllowed, model.gameLine);
    const expectedAttempts = calculateExpectedAttempts(totalPlays.expectedTotalPlays, passRate.expectedPassRate);
    const attemptsOverExpected = calculateAttemptsOverExpected(
      passAttempts.projectedTeamPassAttempts,
      expectedAttempts
    );

    const ypa = calculateExpectedYardsPerAttempt(
      model.currentSeasonGames,
      model.priorSeasonGames,
      model.opponentGamesAllowed
    );
    const expectedPassingYards = calculateExpectedPassingYards(expectedAttempts, ypa.expectedYardsPerAttempt);
    const projectedPassingYards = calculateProjectedPassingYards(
      passAttempts.projectedTeamPassAttempts,
      ypa.expectedYardsPerAttempt
    );
    const yardsOverExpected = calculateYardsOverExpected(projectedPassingYards, expectedPassingYards);

    const fallbacksUsed = dedupe<FallbackReason>([
      ...passAttempts.fallbacksUsed,
      ...totalPlays.fallbacksUsed,
      ...passRate.fallbacksUsed,
      ...ypa.fallbacksUsed,
    ]);

    const warnings = dedupe<WarningReason>([
      ...freshness.warnings,
      ...(unmatched ? (['UNMATCHED_PLAYER'] as WarningReason[]) : []),
    ]);

    const confidence = deriveConfidence(model, fallbacksUsed, warnings, unmatched);

    const result: PassingProjectionResult = {
      gsisId: model.gsisId,
      playerName: model.playerName,
      team: model.team,
      opponentTeam: model.opponentTeam,
      espnProjectedAttempts: round(model.espnProjectedAttempts, 1),
      espnProjectedPassingYards: round(model.espnProjectedPassingYards, 1),
      projectedTeamPassAttempts: round(passAttempts.projectedTeamPassAttempts, 1),
      expectedTotalPlays: round(totalPlays.expectedTotalPlays, 1),
      expectedPassRate: round(passRate.expectedPassRate, 3),
      expectedAttempts: round(expectedAttempts, 1),
      attemptsOverExpected,
      expectedYardsPerAttempt: round(ypa.expectedYardsPerAttempt, 2),
      expectedPassingYards: round(expectedPassingYards, 1),
      projectedPassingYards: round(projectedPassingYards, 1),
      yardsOverExpected,
      vegasSpread: model.gameLine?.spread ?? null,
      vegasTotal: model.gameLine?.total ?? null,
      dataSeason: input.season,
      dataWeek: input.week,
      dataLastUpdated: input.nflverseFetchedAt,
      confidence,
      fallbacksUsed,
      warnings,
    };

    return result;
  });

  return [...results, ...skippedResults];
}

function baseResult(
  model: QbModelInput,
  input: BuildPassingProjectionsInput,
  skipped: 'OUT' | 'BYE',
  freshnessWarnings: WarningReason[]
): PassingProjectionResult {
  return {
    gsisId: model.gsisId,
    playerName: model.playerName,
    team: model.team,
    opponentTeam: model.opponentTeam,
    espnProjectedAttempts: round(model.espnProjectedAttempts, 1),
    espnProjectedPassingYards: round(model.espnProjectedPassingYards, 1),
    projectedTeamPassAttempts: null,
    expectedTotalPlays: null,
    expectedPassRate: null,
    expectedAttempts: null,
    attemptsOverExpected: null,
    expectedYardsPerAttempt: null,
    expectedPassingYards: null,
    projectedPassingYards: null,
    yardsOverExpected: null,
    vegasSpread: null,
    vegasTotal: null,
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
  model: QbModelInput,
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
    'VEGAS_LINE_MISSING',
  ];
  const hasMedium = [...fallbacksUsed, ...warnings].some((r) => mediumTriggers.includes(r));
  return hasMedium ? 'medium' : 'high';
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

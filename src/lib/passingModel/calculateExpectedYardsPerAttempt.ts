// STEP P4 — Expected Yards Per Attempt.
//
// Mirrors calculateExpectedCatchRate.ts's shrinkage pattern: the QB's own
// recency-weighted Y/A, regressed toward a league-average baseline via
// Bayesian shrinkage (a 3-attempt game is not a real 12 YPA sample), then
// blended with the opponent's own yards-allowed-per-attempt.

import { PASSING_MODEL_WEIGHTS, PASSING_REGRESSION } from './config.js';
import { recencyWeightedBlend } from '../receptionModel/recencyBlend.js';
import type { QbGameLog, TeamPassingGameLog, FallbackReason } from './types.js';

function gameYpa(g: QbGameLog): number | null {
  if (g.attempts <= 0) return null;
  return g.passingYards / g.attempts;
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return sum(nums) / nums.length;
}

export interface ExpectedYardsPerAttemptResult {
  expectedYardsPerAttempt: number | null;
  fallbacksUsed: FallbackReason[];
}

export function calculateExpectedYardsPerAttempt(
  currentSeasonGames: QbGameLog[],
  priorSeasonGames: QbGameLog[],
  opponentGamesAllowed: TeamPassingGameLog[]
): ExpectedYardsPerAttemptResult {
  const blend = recencyWeightedBlend(
    currentSeasonGames.map(gameYpa),
    priorSeasonGames.map(gameYpa),
    false
  );

  const currentAttempts = sum(currentSeasonGames.map((g) => g.attempts));
  const priorAttempts = sum(priorSeasonGames.map((g) => g.attempts));
  const sampleAttempts = currentAttempts > 0 ? currentAttempts : priorAttempts;

  const k = PASSING_REGRESSION.YPA_REGRESSION_ATTEMPTS;
  const baseline = PASSING_REGRESSION.BASELINE_YARDS_PER_ATTEMPT;

  const ownYpa =
    blend.value === null ? null : (blend.value * sampleAttempts + baseline * k) / (sampleAttempts + k);

  const opponentYpaAllowed = average(
    opponentGamesAllowed
      .filter((g) => g.passAttempts > 0)
      .map((g) => g.passingYards / g.passAttempts)
  );

  let expectedYardsPerAttempt: number | null;
  if (ownYpa !== null && opponentYpaAllowed !== null) {
    expectedYardsPerAttempt =
      PASSING_MODEL_WEIGHTS.OWN_YPA_WEIGHT * ownYpa +
      PASSING_MODEL_WEIGHTS.OPPONENT_YPA_ALLOWED_WEIGHT * opponentYpaAllowed;
  } else if (ownYpa !== null) {
    expectedYardsPerAttempt = ownYpa;
  } else if (opponentYpaAllowed !== null) {
    expectedYardsPerAttempt = opponentYpaAllowed;
  } else {
    expectedYardsPerAttempt = baseline;
  }

  return { expectedYardsPerAttempt, fallbacksUsed: blend.fallbacksUsed };
}

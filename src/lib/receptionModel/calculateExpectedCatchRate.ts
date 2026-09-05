// STEP 4 — Expected catch rate.
//
// Starts from the player's historical catch rate (receptions / targets),
// recency-blended the same way as target share (Step 1), then regresses it
// toward a WR baseline via Bayesian shrinkage so a tiny sample can't swing
// the projection — a 2-target, 2-catch game is not a 100% catch-rate player.
// aDOT (target depth) is folded in as a small supporting nudge, per spec.

import { REGRESSION, CATCH_RATE_BOUNDS } from './config.js';
import { recencyWeightedBlend, type RecencyBlendResult } from './recencyBlend.js';
import type { PlayerGameLog, PlayerModelInput, FallbackReason } from './types.js';

function gameCatchRate(g: PlayerGameLog): number | null {
  if (g.targets <= 0) return null; // no targets that game — not a 0% catch rate, just no data point
  return g.receptions / g.targets;
}

function gameAdot(g: PlayerGameLog): number | null {
  if (g.targets <= 0) return null;
  return g.receivingAirYards / g.targets;
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return sum(nums) / nums.length;
}

export interface CatchRateResult {
  expectedCatchRate: number | null;
  fallbacksUsed: FallbackReason[];
}

export function calculateExpectedCatchRate(player: PlayerModelInput): CatchRateResult {
  const currentValues = player.currentSeasonGames.map(gameCatchRate);
  const priorValues = player.priorSeasonGames.map(gameCatchRate);

  const blend: RecencyBlendResult = recencyWeightedBlend(
    currentValues,
    priorValues,
    player.isTeamChangeThisSeason
  );

  if (blend.value === null) {
    return { expectedCatchRate: null, fallbacksUsed: blend.fallbacksUsed };
  }

  // Shrinkage sample size: prefer current-season target volume; fall back to
  // prior season's if the current season has none yet.
  const currentTargets = sum(player.currentSeasonGames.map((g) => g.targets));
  const priorTargets = sum(player.priorSeasonGames.map((g) => g.targets));
  const sampleTargets = currentTargets > 0 ? currentTargets : priorTargets;

  const k = REGRESSION.CATCH_RATE_REGRESSION_TARGETS;
  let shrunk =
    (blend.value * sampleTargets + REGRESSION.BASELINE_CATCH_RATE * k) / (sampleTargets + k);

  // aDOT supporting nudge: shallower-than-average depth of target nudges
  // catch rate up, deeper nudges it down.
  const adotValues = [...player.currentSeasonGames, ...player.priorSeasonGames]
    .map(gameAdot)
    .filter((v): v is number => v !== null);
  const adot = average(adotValues);
  if (adot !== null) {
    const raw = (REGRESSION.LEAGUE_AVG_ADOT - adot) * REGRESSION.ADOT_CATCH_RATE_SENSITIVITY;
    const clamped = Math.max(-REGRESSION.ADOT_MAX_ADJUSTMENT, Math.min(REGRESSION.ADOT_MAX_ADJUSTMENT, raw));
    shrunk += clamped;
  }

  const bounded = Math.max(CATCH_RATE_BOUNDS.min, Math.min(CATCH_RATE_BOUNDS.max, shrunk));

  return { expectedCatchRate: bounded, fallbacksUsed: blend.fallbacksUsed };
}

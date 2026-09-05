// STEP P1 — Expected Total Plays: a pure context/pace estimate, deliberately
// independent of either team's own game-script tendencies (the Vegas total
// nudge below is what carries game-script/volume signal, not team history).
//
// ExpectedTotalPlays =
//   (OwnPace x OWN_PACE_WEIGHT) + (OpponentPaceAllowed x OPPONENT_PACE_WEIGHT)
//   + VegasTotalNudge (clamped ±MAX_PACE_ADJUSTMENT)
//
// "Plays" = passAttempts + carries per game (nflverse doesn't publish a
// dedicated "plays" column; this is the standard proxy).

import { PASSING_MODEL_WEIGHTS, PASSING_REGRESSION } from './config.js';
import { recencyWeightedBlend } from '../receptionModel/recencyBlend.js';
import type { TeamPassingGameLog, GameLineInput, FallbackReason } from './types.js';

function gamePlays(g: TeamPassingGameLog): number {
  return g.passAttempts + g.carries;
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export interface ExpectedTotalPlaysResult {
  expectedTotalPlays: number | null;
  fallbacksUsed: FallbackReason[];
}

export function calculateExpectedTotalPlays(
  currentTeamGames: TeamPassingGameLog[],
  priorTeamGames: TeamPassingGameLog[],
  opponentGamesAllowed: TeamPassingGameLog[],
  gameLine: GameLineInput | null
): ExpectedTotalPlaysResult {
  const ownBlend = recencyWeightedBlend(
    currentTeamGames.map((g) => gamePlays(g)),
    priorTeamGames.map((g) => gamePlays(g)),
    false
  );
  const opponentAllowed = average(opponentGamesAllowed.map(gamePlays));

  const fallbacksUsed: FallbackReason[] = [...ownBlend.fallbacksUsed];

  let basePlays: number | null;
  if (ownBlend.value !== null && opponentAllowed !== null) {
    basePlays =
      PASSING_MODEL_WEIGHTS.OWN_PACE_WEIGHT * ownBlend.value +
      PASSING_MODEL_WEIGHTS.OPPONENT_PACE_WEIGHT * opponentAllowed;
  } else if (ownBlend.value !== null) {
    basePlays = ownBlend.value;
  } else if (opponentAllowed !== null) {
    basePlays = opponentAllowed;
  } else {
    basePlays = null;
  }

  if (basePlays === null) {
    return { expectedTotalPlays: null, fallbacksUsed };
  }

  if (gameLine?.total == null) {
    fallbacksUsed.push('VEGAS_LINE_MISSING');
    return { expectedTotalPlays: basePlays, fallbacksUsed };
  }

  const raw =
    (gameLine.total - PASSING_REGRESSION.LEAGUE_AVG_VEGAS_TOTAL) * PASSING_REGRESSION.PLAYS_PER_TOTAL_POINT;
  const nudge = Math.max(
    -PASSING_REGRESSION.MAX_PACE_ADJUSTMENT,
    Math.min(PASSING_REGRESSION.MAX_PACE_ADJUSTMENT, raw)
  );

  return { expectedTotalPlays: basePlays + nudge, fallbacksUsed };
}

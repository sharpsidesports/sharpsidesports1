// STEP P2 — Expected Pass Rate: a league baseline adjusted for Vegas-implied
// game script and the opponent's own pass-funnel tendency.
//
// ExpectedPassRate = clamp(
//   LEAGUE_BASE_PASS_RATE + ScriptAdjustment + OpponentFunnelAdjustment,
//   MIN_PASS_RATE, MAX_PASS_RATE
// )
//
// ScriptAdjustment: spread convention is "this team's own spread, negative
// = favorite" — a positive spread (underdog) nudges pass rate UP (trailing
// teams pass more); a favorite nudges it down.
// OpponentFunnelAdjustment: how far the opponent's own allowed pass rate
// sits from league average, weighted down (a supporting signal, not primary).

import { PASSING_REGRESSION } from './config.js';
import type { TeamPassingGameLog, GameLineInput, FallbackReason } from './types.js';

function passRate(g: TeamPassingGameLog): number | null {
  const totalPlays = g.passAttempts + g.carries;
  if (totalPlays <= 0) return null;
  return g.passAttempts / totalPlays;
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export interface ExpectedPassRateResult {
  expectedPassRate: number;
  fallbacksUsed: FallbackReason[];
}

export function calculateExpectedPassRate(
  opponentGamesAllowed: TeamPassingGameLog[],
  gameLine: GameLineInput | null
): ExpectedPassRateResult {
  const fallbacksUsed: FallbackReason[] = [];

  let scriptAdjustment = 0;
  if (gameLine?.spread == null) {
    fallbacksUsed.push('VEGAS_LINE_MISSING');
  } else {
    const raw = gameLine.spread * PASSING_REGRESSION.SCRIPT_SENSITIVITY;
    scriptAdjustment = Math.max(
      -PASSING_REGRESSION.MAX_SCRIPT_ADJUSTMENT,
      Math.min(PASSING_REGRESSION.MAX_SCRIPT_ADJUSTMENT, raw)
    );
  }

  const opponentAvgPassRate = average(
    opponentGamesAllowed.map(passRate).filter((v): v is number => v !== null)
  );
  const funnelAdjustment =
    opponentAvgPassRate !== null
      ? (opponentAvgPassRate - PASSING_REGRESSION.LEAGUE_BASE_PASS_RATE) * PASSING_REGRESSION.OPPONENT_FUNNEL_WEIGHT
      : 0;

  const raw = PASSING_REGRESSION.LEAGUE_BASE_PASS_RATE + scriptAdjustment + funnelAdjustment;
  const bounded = Math.max(PASSING_REGRESSION.MIN_PASS_RATE, Math.min(PASSING_REGRESSION.MAX_PASS_RATE, raw));

  return { expectedPassRate: bounded, fallbacksUsed };
}

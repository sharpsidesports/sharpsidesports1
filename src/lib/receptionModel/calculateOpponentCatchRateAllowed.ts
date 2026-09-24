// "Opp Catch % Allowed" — the upcoming opponent's average completion rate
// allowed (completions / pass attempts, any team they've faced). Higher =
// softer coverage = more favorable for this WR, so no inversion needed when
// this feeds the Sharp Score.

import type { TeamGameLog } from './types.js';

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calculateOpponentCatchRateAllowed(opponentGamesAllowed: TeamGameLog[]): number | null {
  const rates = opponentGamesAllowed
    .filter((g) => g.passAttempts > 0)
    .map((g) => g.completions / g.passAttempts);
  return average(rates);
}

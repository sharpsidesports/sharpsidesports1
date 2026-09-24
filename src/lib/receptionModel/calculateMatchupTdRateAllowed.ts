// "Matchup" — the upcoming opponent's average rushing + passing TDs allowed
// per game (any team they've faced, current + prior season). Informational
// context column; not currently a Sharp Score input (a TD-rate signal is a
// more natural fit for the Anytime-TD model's own Sharp Score).

import type { TeamGameLog } from './types.js';

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calculateMatchupTdRateAllowed(opponentGamesAllowed: TeamGameLog[]): number | null {
  return average(opponentGamesAllowed.map((g) => g.rushingTds + g.passingTds));
}

// "Reception Debt" — season-to-date projected receptions minus actual
// receptions. Positive = the model expected more catches than he's gotten
// (a "due" signal); negative = he's outperforming what was projected.
//
// Joins persisted per-week projections against actually-played games by
// week (not a blind sum of both arrays) so a bye/injury week that still has
// a stale persisted projection, but no actual game, can't skew the total.

import type { PlayerGameLog } from './types.js';

export function calculateReceptionDebt(
  seasonProjectedReceptions: { week: number; projectedReceptions: number }[],
  currentSeasonGames: PlayerGameLog[]
): number | null {
  const actualByWeek = new Map(currentSeasonGames.map((g) => [g.week, g.receptions]));

  let sumProjected = 0;
  let sumActual = 0;
  let matchedWeeks = 0;

  for (const { week, projectedReceptions } of seasonProjectedReceptions) {
    const actual = actualByWeek.get(week);
    if (actual === undefined) continue;
    sumProjected += projectedReceptions;
    sumActual += actual;
    matchedWeeks += 1;
  }

  if (matchedWeeks === 0) return null;
  return sumProjected - sumActual;
}

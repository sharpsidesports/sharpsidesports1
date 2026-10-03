// "Opp Catch % Allowed to WR" — same idea as calculateOpponentCatchRateAllowed,
// but filtered to what the opponent has specifically given up to WRs, not
// every position lumped together. More accurate for this WR-only page:
// a defense can be generous to RBs on check-downs while locking down WRs,
// and the team-wide number can't tell those two apart.
//
// Takes per-game (targets, receptions) pairs already filtered to the
// opponent + position by the caller (buildWeeklyReceptionProjections.ts,
// which has the full non-QB-position-wide playerWeekStats array loaded).

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calculateOpponentCatchRateAllowedByPosition(
  gamesAllowedToPosition: { targets: number; receptions: number }[]
): number | null {
  const rates = gamesAllowedToPosition.filter((g) => g.targets > 0).map((g) => g.receptions / g.targets);
  return average(rates);
}

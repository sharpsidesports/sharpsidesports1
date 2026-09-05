// AttemptsOverExpected = ProjectedTeamPassAttempts (the team's actual
// projected volume, reused from the reception model) - ExpectedAttempts
// (the pure-context baseline). Rounded to 1 decimal, same as
// receptionModel/calculateProjectionDifference.ts.

export function calculateAttemptsOverExpected(
  projectedTeamPassAttempts: number | null,
  expectedAttempts: number | null
): number | null {
  if (projectedTeamPassAttempts === null || expectedAttempts === null) return null;
  return Math.round((projectedTeamPassAttempts - expectedAttempts) * 10) / 10;
}

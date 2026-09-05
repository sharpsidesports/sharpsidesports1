// STEP P6 — ProjectedPassingYards = ProjectedTeamPassAttempts (the team's
// actual projected volume, reused from the reception model) x Expected
// Yards Per Attempt. This is the "actual side" compared against Expected
// Passing Yards (the pure-context side) to produce Yards Over Expected.

export function calculateProjectedPassingYards(
  projectedTeamPassAttempts: number | null,
  expectedYardsPerAttempt: number | null
): number | null {
  if (projectedTeamPassAttempts === null || expectedYardsPerAttempt === null) return null;
  return projectedTeamPassAttempts * expectedYardsPerAttempt;
}

// YardsOverExpected = ProjectedPassingYards - ExpectedPassingYards.
// Rounded to 1 decimal, same as calculateAttemptsOverExpected.ts.

export function calculateYardsOverExpected(
  projectedPassingYards: number | null,
  expectedPassingYards: number | null
): number | null {
  if (projectedPassingYards === null || expectedPassingYards === null) return null;
  return Math.round((projectedPassingYards - expectedPassingYards) * 10) / 10;
}

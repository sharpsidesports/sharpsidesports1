// STEP P5 — ExpectedPassingYards = ExpectedAttempts x ExpectedYardsPerAttempt.

export function calculateExpectedPassingYards(
  expectedAttempts: number | null,
  expectedYardsPerAttempt: number | null
): number | null {
  if (expectedAttempts === null || expectedYardsPerAttempt === null) return null;
  return expectedAttempts * expectedYardsPerAttempt;
}

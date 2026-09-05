// STEP P3 — ExpectedAttempts = ExpectedTotalPlays x ExpectedPassRate.
// Unrounded internally; only rounded for display by the caller.

export function calculateExpectedAttempts(
  expectedTotalPlays: number | null,
  expectedPassRate: number | null
): number | null {
  if (expectedTotalPlays === null || expectedPassRate === null) return null;
  return expectedTotalPlays * expectedPassRate;
}

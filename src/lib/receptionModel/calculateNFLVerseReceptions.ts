// STEP 5 — NFLVerseProjectedReceptions = Projected Targets x Expected Catch Rate.
// Unrounded internally.

export function calculateNFLVerseReceptions(
  projectedTargets: number | null,
  expectedCatchRate: number | null
): number | null {
  if (projectedTargets === null || expectedCatchRate === null) return null;
  return projectedTargets * expectedCatchRate;
}

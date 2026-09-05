// STEP 3 — Projected targets = Projected Team Pass Attempts x Expected Target Share.
// Unrounded internally; only rounded for display by the caller.

export function calculateProjectedTargets(
  projectedTeamPassAttempts: number | null,
  expectedTargetShare: number | null
): number | null {
  if (projectedTeamPassAttempts === null || expectedTargetShare === null) return null;
  return projectedTeamPassAttempts * expectedTargetShare;
}

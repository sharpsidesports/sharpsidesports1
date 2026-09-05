// The baseline prior, kept independently callable: thin lookup over ESPN's
// own live weekly QB passing projections (src/lib/espnProjections.ts ->
// getEspnWeekPassingProjections).

import type { EspnQbPassingProjection } from '../espnProjections.js';

export function calculateEspnPassingProjection(
  espnId: string,
  espnProjectionsByEspnId: Map<string, EspnQbPassingProjection>
): { projectedAttempts: number | null; projectedPassingYards: number | null } {
  const p = espnProjectionsByEspnId.get(espnId);
  return {
    projectedAttempts: p?.projectedAttempts ?? null,
    projectedPassingYards: p?.projectedPassingYards ?? null,
  };
}

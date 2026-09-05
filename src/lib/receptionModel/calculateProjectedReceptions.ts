// STEP 6 — Blend the ESPN baseline prior with the from-scratch nflverse
// model into the final projected receptions.
//
// FinalProjectedReceptions =
//   (EspnProjectedReceptions   x ESPN_PROJECTION_WEIGHT)
// + (NFLVerseProjectedReceptions x NFLVERSE_MODEL_WEIGHT)
//
// If the nflverse component is unavailable (rookie with no history, missing
// data, etc.) this falls back to the ESPN projection alone rather than
// silently treating the missing component as 0 — the blend weights only
// apply when both inputs exist.

import { MODEL_WEIGHTS } from './config.js';
import type { FallbackReason } from './types.js';

export interface ProjectedReceptionsResult {
  finalProjectedReceptionsRaw: number | null;
  projectedReceptions: number | null; // rounded to 1 decimal for display
  fallbacksUsed: FallbackReason[];
}

export function calculateProjectedReceptions(
  espnProjectedReceptions: number | null,
  nflverseProjectedReceptions: number | null
): ProjectedReceptionsResult {
  const fallbacksUsed: FallbackReason[] = [];

  let raw: number | null;
  if (espnProjectedReceptions !== null && nflverseProjectedReceptions !== null) {
    raw =
      espnProjectedReceptions * MODEL_WEIGHTS.ESPN_PROJECTION_WEIGHT +
      nflverseProjectedReceptions * MODEL_WEIGHTS.NFLVERSE_MODEL_WEIGHT;
  } else if (espnProjectedReceptions !== null) {
    raw = espnProjectedReceptions;
    fallbacksUsed.push('NFLVERSE_DATA_MISSING_ESPN_ONLY');
  } else if (nflverseProjectedReceptions !== null) {
    raw = nflverseProjectedReceptions; // ESPN unavailable — nflverse-only fallback
  } else {
    raw = null;
  }

  return {
    finalProjectedReceptionsRaw: raw,
    projectedReceptions: raw === null ? null : Math.round(raw * 10) / 10,
    fallbacksUsed,
  };
}

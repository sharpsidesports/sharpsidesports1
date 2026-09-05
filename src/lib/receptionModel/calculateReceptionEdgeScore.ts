// PART 2 — Reception Edge Score.
//
// A 0-100 RELATIVE ranking of reception opportunity/profile against the
// current WR pool being projected that week — NOT the projected reception
// count itself, and never used to derive it. Each input is min-max
// normalized independently, within the pool, before weighting.
//
// RawEdge =
//   (NormalizedEspn         x EDGE_ESPN_WEIGHT)
// + (NormalizedTargetVolume x EDGE_TARGET_VOLUME_WEIGHT)
// + (NormalizedTargetShare  x EDGE_TARGET_SHARE_WEIGHT)
// ReceptionEdgeScore = round(RawEdge x 100)

import { MODEL_WEIGHTS } from './config.js';

export interface EdgeScoreInput {
  espnProjectedReceptions: number | null;
  // Prefer projected targets; recency-weighted targets-per-game is the
  // fallback when projected targets aren't available for this player.
  targetVolume: number | null;
  expectedTargetShare: number | null;
}

function minMaxNormalize(value: number | null, values: (number | null)[]): number {
  const finite = values.filter((v): v is number => v !== null);
  if (value === null || finite.length === 0) return 0; // no signal — contributes nothing, doesn't drag others down
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (max === min) return 1; // everyone identical on this input — treat as full credit, not a divide-by-zero
  return (value - min) / (max - min);
}

// Computes the Edge Score for every player in the pool at once, since
// min-max normalization is inherently relative to the whole pool.
export function calculateReceptionEdgeScore(pool: EdgeScoreInput[]): number[] {
  const espnValues = pool.map((p) => p.espnProjectedReceptions);
  const volumeValues = pool.map((p) => p.targetVolume);
  const shareValues = pool.map((p) => p.expectedTargetShare);

  return pool.map((player) => {
    const normEspn = minMaxNormalize(player.espnProjectedReceptions, espnValues);
    const normVolume = minMaxNormalize(player.targetVolume, volumeValues);
    const normShare = minMaxNormalize(player.expectedTargetShare, shareValues);

    const rawEdge =
      normEspn * MODEL_WEIGHTS.EDGE_ESPN_WEIGHT +
      normVolume * MODEL_WEIGHTS.EDGE_TARGET_VOLUME_WEIGHT +
      normShare * MODEL_WEIGHTS.EDGE_TARGET_SHARE_WEIGHT;

    return Math.round(rawEdge * 100);
  });
}

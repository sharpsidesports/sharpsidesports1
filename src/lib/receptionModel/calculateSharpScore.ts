// Sharp Score (Phase 1) — a 0-100 RELATIVE ranking across the current WR
// pool, like the Reception Edge Score but widened with matchup/environment/
// debt signals. Same min-max-normalize-then-weight approach; each input is
// normalized independently within the pool before weighting.
//
// RawScore =
//   (NormalizedEspn              x SHARP_ESPN_WEIGHT)
// + (NormalizedTargetVolume      x SHARP_TARGET_VOLUME_WEIGHT)
// + (NormalizedTargetShare       x SHARP_TARGET_SHARE_WEIGHT)
// + (NormalizedImpliedTotal      x SHARP_IMPLIED_TOTAL_WEIGHT)
// + (NormalizedOppCatchPctAllowed x SHARP_OPP_CATCH_PCT_ALLOWED_WEIGHT)
// + (NormalizedReceptionDebt     x SHARP_RECEPTION_DEBT_WEIGHT)
// SharpScore = round(RawScore x 100)
//
// All six inputs point the same direction (higher raw value = more
// favorable for the player), so none need inverting before normalization.

import { MODEL_WEIGHTS } from './config.js';

export interface SharpScoreInput {
  espnProjectedReceptions: number | null;
  targetVolume: number | null;
  expectedTargetShare: number | null;
  impliedTeamTotal: number | null;
  opponentCatchPctAllowed: number | null;
  receptionDebt: number | null;
}

function minMaxNormalize(value: number | null, values: (number | null)[]): number {
  const finite = values.filter((v): v is number => v !== null);
  if (value === null || finite.length === 0) return 0; // no signal — contributes nothing, doesn't drag others down
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (max === min) return 1; // everyone identical on this input — treat as full credit, not a divide-by-zero
  return (value - min) / (max - min);
}

// Computes the Sharp Score for every player in the pool at once, since
// min-max normalization is inherently relative to the whole pool.
export function calculateSharpScore(pool: SharpScoreInput[]): number[] {
  const espnValues = pool.map((p) => p.espnProjectedReceptions);
  const volumeValues = pool.map((p) => p.targetVolume);
  const shareValues = pool.map((p) => p.expectedTargetShare);
  const impliedTotalValues = pool.map((p) => p.impliedTeamTotal);
  const oppCatchPctValues = pool.map((p) => p.opponentCatchPctAllowed);
  const debtValues = pool.map((p) => p.receptionDebt);

  return pool.map((player) => {
    const normEspn = minMaxNormalize(player.espnProjectedReceptions, espnValues);
    const normVolume = minMaxNormalize(player.targetVolume, volumeValues);
    const normShare = minMaxNormalize(player.expectedTargetShare, shareValues);
    const normImpliedTotal = minMaxNormalize(player.impliedTeamTotal, impliedTotalValues);
    const normOppCatchPct = minMaxNormalize(player.opponentCatchPctAllowed, oppCatchPctValues);
    const normDebt = minMaxNormalize(player.receptionDebt, debtValues);

    const rawScore =
      normEspn * MODEL_WEIGHTS.SHARP_ESPN_WEIGHT +
      normVolume * MODEL_WEIGHTS.SHARP_TARGET_VOLUME_WEIGHT +
      normShare * MODEL_WEIGHTS.SHARP_TARGET_SHARE_WEIGHT +
      normImpliedTotal * MODEL_WEIGHTS.SHARP_IMPLIED_TOTAL_WEIGHT +
      normOppCatchPct * MODEL_WEIGHTS.SHARP_OPP_CATCH_PCT_ALLOWED_WEIGHT +
      normDebt * MODEL_WEIGHTS.SHARP_RECEPTION_DEBT_WEIGHT;

    return Math.round(rawScore * 100);
  });
}

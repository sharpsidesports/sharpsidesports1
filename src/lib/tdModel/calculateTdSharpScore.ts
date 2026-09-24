// Sharp Score for the Anytime-TD model (Phase 1) — same 0-100 relative
// pool-ranking approach as the reception model's Sharp Score
// (src/lib/receptionModel/calculateSharpScore.ts): min-max normalize each
// input across the current player pool, weight, sum, round x100. Kept as its
// own small implementation (rather than importing the reception model's
// helper) to avoid a cross-model dependency for a ~6-line function.
//
// All five inputs point the same direction (higher raw value = more
// favorable for the player), so none need inverting before normalization.
// `consensusTdProbability` and `edge` are frequently null (sportsbook odds
// not matched, or no market price at all) — minMaxNormalize treats a null
// input as contributing 0 without dragging the other components down, so a
// null-heavy pool still produces a sane score from ESPN/implied-total/
// matchup alone.

const TD_SHARP_SCORE_WEIGHTS = {
  ESPN_TD_PROBABILITY_WEIGHT: 0.35,
  CONSENSUS_TD_PROBABILITY_WEIGHT: 0.3,
  EDGE_WEIGHT: 0.15,
  IMPLIED_TEAM_TOTAL_WEIGHT: 0.1,
  MATCHUP_TD_RATE_ALLOWED_WEIGHT: 0.1,
} as const;

export interface TdSharpScoreInput {
  espnTdProbability: number;
  consensusTdProbability: number | null;
  edge: number | null;
  impliedTeamTotal: number | null;
  matchupTdRateAllowed: number | null;
}

function minMaxNormalize(value: number | null, values: (number | null)[]): number {
  const finite = values.filter((v): v is number => v !== null);
  if (value === null || finite.length === 0) return 0;
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (max === min) return 1;
  return (value - min) / (max - min);
}

export function calculateTdSharpScore(pool: TdSharpScoreInput[]): number[] {
  const espnValues = pool.map((p): number | null => p.espnTdProbability);
  const consensusValues = pool.map((p) => p.consensusTdProbability);
  const edgeValues = pool.map((p) => p.edge);
  const impliedTotalValues = pool.map((p) => p.impliedTeamTotal);
  const matchupValues = pool.map((p) => p.matchupTdRateAllowed);

  return pool.map((player) => {
    const normEspn = minMaxNormalize(player.espnTdProbability, espnValues);
    const normConsensus = minMaxNormalize(player.consensusTdProbability, consensusValues);
    const normEdge = minMaxNormalize(player.edge, edgeValues);
    const normImpliedTotal = minMaxNormalize(player.impliedTeamTotal, impliedTotalValues);
    const normMatchup = minMaxNormalize(player.matchupTdRateAllowed, matchupValues);

    const rawScore =
      normEspn * TD_SHARP_SCORE_WEIGHTS.ESPN_TD_PROBABILITY_WEIGHT +
      normConsensus * TD_SHARP_SCORE_WEIGHTS.CONSENSUS_TD_PROBABILITY_WEIGHT +
      normEdge * TD_SHARP_SCORE_WEIGHTS.EDGE_WEIGHT +
      normImpliedTotal * TD_SHARP_SCORE_WEIGHTS.IMPLIED_TEAM_TOTAL_WEIGHT +
      normMatchup * TD_SHARP_SCORE_WEIGHTS.MATCHUP_TD_RATE_ALLOWED_WEIGHT;

    return Math.round(rawScore * 100);
  });
}

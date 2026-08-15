// Shared American-odds <-> implied-probability helpers.
// Used by both the ESPN projections and sportsbook consensus code.

export function americanOddsToImpliedProbability(odds: number): number {
  if (odds > 0) return 100 / (odds + 100);
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

// Converts a probability back into fair (no-vig) American odds for display.
export function probabilityToFairAmericanOdds(probability: number): number | null {
  if (!(probability > 0) || probability >= 1) return null;
  if (probability >= 0.5) {
    return Math.round(-100 * (probability / (1 - probability)));
  }
  return Math.round(100 * ((1 - probability) / probability));
}

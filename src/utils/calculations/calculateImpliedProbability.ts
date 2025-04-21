/**
 * Converts American betting odds to an implied probability (between 0 and 1).
 * Positive odds (e.g., +200) = underdog
 * Negative odds (e.g., -150) = favorite
 */
export function calculateImpliedProbability(odds: number): number {
    if (odds > 0) {
      return 100 / (odds + 100);
    } else {
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
  }
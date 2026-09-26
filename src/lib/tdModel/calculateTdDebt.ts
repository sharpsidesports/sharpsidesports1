// "TD Debt" — season-to-date Expected TDs (from calculateZoneExpectedTds)
// minus actual TDs scored. Positive = the ball has found him in scoring
// spots more than the scoreboard shows (a "due" signal); negative = he's
// outscoring what his touch locations would suggest. Both inputs are
// already season-cumulative, so this is a plain subtraction — no per-week
// join needed (unlike Reception Debt, which compares a locked-in weekly
// projection against that week's actual result).
export function calculateTdDebt(expectedTds: number | null, scored: number | null): number | null {
  if (expectedTds === null || scored === null) return null;
  return expectedTds - scored;
}

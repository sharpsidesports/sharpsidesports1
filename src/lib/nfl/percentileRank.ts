// Fraction of a pool a value is >= to (0-1). Used for presentation-only tag
// chips ("High Volume", "Plus Matchup", ...) — not part of any score
// calculation, just a threshold check against the current pool.
export function percentileRank(value: number | null, pool: (number | null)[]): number | null {
  if (value === null) return null;
  const finite = pool.filter((v): v is number => v !== null);
  if (finite.length === 0) return null;
  const atOrBelow = finite.filter((v) => v <= value).length;
  return atOrBelow / finite.length;
}

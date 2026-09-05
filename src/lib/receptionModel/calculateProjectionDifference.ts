// OPTIONAL METRIC — ProjectionDifference = FinalProjectedReceptions - EspnProjectedReceptions.
// Displayed as "vs. ESPN" (this is not a betting market, so it isn't called
// a "market edge").

export function calculateProjectionDifference(
  finalProjectedReceptionsRaw: number | null,
  espnProjectedReceptions: number | null
): number | null {
  if (finalProjectedReceptionsRaw === null || espnProjectedReceptions === null) return null;
  return Math.round((finalProjectedReceptionsRaw - espnProjectedReceptions) * 10) / 10;
}

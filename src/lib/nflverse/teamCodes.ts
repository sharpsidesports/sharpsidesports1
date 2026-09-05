// ESPN and nflverse disagree on two team abbreviations (verified against
// live data from both sources): the Rams (nflverse "LA" / ESPN "LAR") and
// Washington (nflverse "WAS" / ESPN "WSH"). Every join between ESPN and
// nflverse data must go through this normalizer first, or those two teams
// silently fail to match.
const ESPN_TO_NFLVERSE: Record<string, string> = {
  LAR: 'LA',
  WSH: 'WAS',
};

export function toNflverseTeamCode(espnAbbrev: string): string {
  return ESPN_TO_NFLVERSE[espnAbbrev] ?? espnAbbrev;
}

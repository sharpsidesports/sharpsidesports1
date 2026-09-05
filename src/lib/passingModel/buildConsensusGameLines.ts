// Pure helper: averages spread/total across sportsbooks into a single
// consensus row per team, and derives each team's implied point total.
// Shared by ingestGameLines.ts (persists to Supabase) and loadLive.ts
// (live-only path, no Supabase) so both produce identical shapes.

import type { GameLineOutcome } from '../oddsApi.js';
import type { NflverseGameLineRow } from '../nflverse/types.js';
import { toNflverseTeamCode } from '../nflverse/teamCodes.js';

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function buildConsensusGameLines(
  outcomes: GameLineOutcome[],
  season: number,
  week: number
): NflverseGameLineRow[] {
  // Group by team pair using a direction-independent (sorted) key — The
  // Odds API has been observed listing the same real matchup as two
  // separate events with home/away flipped (seen live for GB/MIN, SF/LA,
  // KC/DEN, PHI/WAS, DAL/NYG in one actual run). Grouping by raw
  // homeAbbrev-awayAbbrev would treat those as two different games and
  // upsert two conflicting rows per team, which Postgres rejects outright
  // ("ON CONFLICT DO UPDATE command cannot affect row a second time").
  const byPair = new Map<string, GameLineOutcome[]>();
  for (const o of outcomes) {
    const key = [o.homeAbbrev, o.awayAbbrev].sort().join('-');
    const existing = byPair.get(key);
    if (existing) existing.push(o);
    else byPair.set(key, [o]);
  }

  const rows: NflverseGameLineRow[] = [];

  for (const group of byPair.values()) {
    // Within a merged group, different event entries may disagree on which
    // team is "home" — take whichever orientation the majority of entries
    // agree on, and only average the entries that share it (mixing
    // opposite-orientation spreads would cancel out to near zero).
    const homeCounts = new Map<string, number>();
    for (const o of group) homeCounts.set(o.homeAbbrev, (homeCounts.get(o.homeAbbrev) ?? 0) + 1);
    const majorityHomeAbbrev = [...homeCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const oriented = group.filter((o) => o.homeAbbrev === majorityHomeAbbrev);

    // The Odds API outcomes carry ESPN-style abbreviations (see oddsApi.ts) —
    // convert to nflverse's codes here so every downstream join (which keys
    // off nflverse-format team codes throughout this app) matches for the
    // Rams/Washington cases where the two disagree.
    const homeTeam = toNflverseTeamCode(oriented[0].homeAbbrev);
    const awayTeam = toNflverseTeamCode(oriented[0].awayAbbrev);
    const homeSpread = average(oriented.map((o) => o.homeSpread).filter((v): v is number => v !== null));
    const awaySpread = average(oriented.map((o) => o.awaySpread).filter((v): v is number => v !== null));
    const total = average(oriented.map((o) => o.total).filter((v): v is number => v !== null));

    rows.push({
      season,
      week,
      team: homeTeam,
      opponentTeam: awayTeam,
      isHome: true,
      spread: homeSpread,
      total,
      impliedTeamTotal: total !== null && homeSpread !== null ? total / 2 - homeSpread / 2 : null,
      bookmaker: 'consensus',
    });
    rows.push({
      season,
      week,
      team: awayTeam,
      opponentTeam: homeTeam,
      isHome: false,
      spread: awaySpread,
      total,
      impliedTeamTotal: total !== null && awaySpread !== null ? total / 2 - awaySpread / 2 : null,
      bookmaker: 'consensus',
    });
  }

  return rows;
}

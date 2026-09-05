// server-only helper
// Master player ID crosswalk from nflverse's `players` release — gives a
// direct gsis_id <-> espn_id join so ESPN and nflverse data can be matched
// by stable ID instead of fuzzy player-name matching.
// File: players.csv

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { PlayerCrosswalkRow } from './types.js';

interface RawRow {
  gsis_id: string;
  display_name: string;
  espn_id: string;
  position: string;
  status: string;
  latest_team: string;
}

export async function fetchPlayerCrosswalk(): Promise<NflverseCsvResult<PlayerCrosswalkRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>('players', 'players.csv');

  const mapped = rows
    .filter((r) => r.gsis_id)
    .map((r): PlayerCrosswalkRow => ({
      gsisId: r.gsis_id,
      espnId: r.espn_id || null,
      displayName: r.display_name,
      position: r.position,
      status: r.status || null,
      latestTeam: r.latest_team || null,
    }));

  return { rows: mapped, fetchedAt, sourceUrl };
}

export function buildEspnToGsisMap(crosswalk: PlayerCrosswalkRow[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of crosswalk) {
    if (row.espnId) map.set(row.espnId, row.gsisId);
  }
  return map;
}

// Normalizes a player name for fallback matching when no espn_id crosswalk
// entry exists yet (e.g. a very recent roster addition): lowercase, strip
// Jr./Sr./II/III/IV suffixes, apostrophes, hyphens, and periods.
export function normalizePlayerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\.?\b/g, '')
    .replace(/['’.\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildNormalizedNameMap(crosswalk: PlayerCrosswalkRow[]): Map<string, PlayerCrosswalkRow[]> {
  const map = new Map<string, PlayerCrosswalkRow[]>();
  for (const row of crosswalk) {
    const key = normalizePlayerName(row.displayName);
    const existing = map.get(key);
    if (existing) existing.push(row);
    else map.set(key, [row]);
  }
  return map;
}

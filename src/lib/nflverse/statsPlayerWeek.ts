// server-only helper
// Weekly receiving + rushing stats (every non-QB position — QBs are covered
// separately by statsQbWeek.ts's own fetch of this same file, so excluding
// them here avoids ingesting the same rows twice) from nflverse's
// `stats_player` release (replaces the deprecated `player_stats` release as
// of 2025-08-01). File: stats_player_week_{season}.csv
//
// Rushing fields were added for the zone-based TD model's "Scored" (season
// actual TDs) input — every other consumer of this table (the reception
// model) only ever reads the receiving fields and explicitly filters its own
// player pool to WR, so widening this to all non-QB positions doesn't change
// its behavior.

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { NflversePlayerWeekRow } from './types.js';

interface RawRow {
  player_id: string;
  player_display_name: string;
  position: string;
  team: string;
  opponent_team: string;
  season: string;
  week: string;
  season_type: string;
  game_id: string;
  targets: string;
  receptions: string;
  receiving_yards: string;
  receiving_tds: string;
  receiving_air_yards: string;
  target_share: string;
  air_yards_share: string;
  racr: string;
  rushing_yards: string;
  rushing_tds: string;
}

// Empty-string numeric fields become null, never 0 — nflverse leaves these
// blank for undefined ratios (e.g. racr when targets is 0), and a blank is
// not the same thing as a real zero.
function toNullableNum(v: string | undefined): number | null {
  if (v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toNum(v: string | undefined, fallback = 0): number {
  const n = toNullableNum(v);
  return n === null ? fallback : n;
}

export async function fetchStatsPlayerWeek(
  season: number
): Promise<NflverseCsvResult<NflversePlayerWeekRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>(
    'stats_player',
    `stats_player_week_${season}.csv`
  );

  const nonQbRows = rows
    .filter((r) => r.position !== 'QB' && r.season_type === 'REG')
    .map((r): NflversePlayerWeekRow => ({
      gsisId: r.player_id,
      playerName: r.player_display_name,
      position: r.position,
      team: r.team,
      opponentTeam: r.opponent_team,
      season: toNum(r.season),
      week: toNum(r.week),
      seasonType: r.season_type,
      gameId: r.game_id,
      targets: toNum(r.targets),
      receptions: toNum(r.receptions),
      receivingYards: toNum(r.receiving_yards),
      receivingTds: toNum(r.receiving_tds),
      receivingAirYards: toNum(r.receiving_air_yards),
      targetShare: toNullableNum(r.target_share),
      airYardsShare: toNullableNum(r.air_yards_share),
      racr: toNullableNum(r.racr),
      rushingYards: toNum(r.rushing_yards),
      rushingTds: toNum(r.rushing_tds),
    }));

  return { rows: nonQbRows, fetchedAt, sourceUrl };
}

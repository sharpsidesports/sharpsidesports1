// server-only helper
// Weekly QB passing stats from nflverse's `stats_player` release — the same
// file statsPlayerWeek.ts reads for WRs, filtered to a different position.
// File: stats_player_week_{season}.csv

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { NflverseQbWeekRow } from './types.js';

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
  completions: string;
  attempts: string;
  passing_yards: string;
  passing_tds: string;
  passing_interceptions: string;
  sacks_suffered: string;
  sack_yards_lost: string;
  passing_air_yards: string;
  passing_yards_after_catch: string;
  passing_first_downs: string;
  passing_epa: string;
  passing_cpoe: string;
  pacr: string;
  carries: string;
  rushing_yards: string;
  rushing_tds: string;
}

// Empty-string numeric fields become null, never 0 — nflverse leaves these
// blank for undefined ratios (e.g. pacr/epa/cpoe on a 0-attempt row), and a
// blank is not the same thing as a real zero.
function toNullableNum(v: string | undefined): number | null {
  if (v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toNum(v: string | undefined, fallback = 0): number {
  const n = toNullableNum(v);
  return n === null ? fallback : n;
}

export async function fetchStatsQbWeek(
  season: number
): Promise<NflverseCsvResult<NflverseQbWeekRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>(
    'stats_player',
    `stats_player_week_${season}.csv`
  );

  const qbRows = rows
    .filter((r) => r.position === 'QB' && r.season_type === 'REG')
    .map((r): NflverseQbWeekRow => ({
      gsisId: r.player_id,
      playerName: r.player_display_name,
      position: r.position,
      team: r.team,
      opponentTeam: r.opponent_team,
      season: toNum(r.season),
      week: toNum(r.week),
      seasonType: r.season_type,
      gameId: r.game_id,
      completions: toNum(r.completions),
      attempts: toNum(r.attempts),
      passingYards: toNum(r.passing_yards),
      passingTds: toNum(r.passing_tds),
      passingInterceptions: toNum(r.passing_interceptions),
      sacksSuffered: toNum(r.sacks_suffered),
      sackYardsLost: toNum(r.sack_yards_lost),
      passingAirYards: toNum(r.passing_air_yards),
      passingYardsAfterCatch: toNum(r.passing_yards_after_catch),
      passingFirstDowns: toNum(r.passing_first_downs),
      passingEpa: toNullableNum(r.passing_epa),
      passingCpoe: toNullableNum(r.passing_cpoe),
      pacr: toNullableNum(r.pacr),
      carries: toNum(r.carries),
      rushingYards: toNum(r.rushing_yards),
      rushingTds: toNum(r.rushing_tds),
    }));

  return { rows: qbRows, fetchedAt, sourceUrl };
}

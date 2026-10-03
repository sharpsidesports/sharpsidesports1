// server-only helper
// Weekly offensive snap counts/share from nflverse's `snap_counts` release.
// Keyed by pfr_player_id, not gsis_id — the caller must map through the
// crosswalk's buildPfrToGsisMap before persisting. File: snap_counts_{season}.csv
//
// Used as a playing-time/role proxy for the Reception Model's "Overlooked"
// signal. Note: offense_pct is "share of offensive snaps," not a literal
// routes-run count (a lineman-style blocking snap counts too) — the closest
// public proxy available, not an exact route-participation stat.

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';

interface RawRow {
  season: string;
  week: string;
  game_type: string;
  player: string;
  pfr_player_id: string;
  position: string;
  team: string;
  opponent: string;
  offense_snaps: string;
  offense_pct: string;
}

export interface RawSnapCountRow {
  pfrPlayerId: string;
  season: number;
  week: number;
  team: string;
  offenseSnaps: number;
  offensePct: number | null;
}

function toNum(v: string | undefined, fallback = 0): number {
  if (v === undefined || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toNullableNum(v: string | undefined): number | null {
  if (v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function fetchSnapCounts(season: number): Promise<NflverseCsvResult<RawSnapCountRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>('snap_counts', `snap_counts_${season}.csv`);

  const mapped = rows
    .filter((r) => r.game_type === 'REG' && r.pfr_player_id)
    .map(
      (r): RawSnapCountRow => ({
        pfrPlayerId: r.pfr_player_id,
        season: toNum(r.season),
        week: toNum(r.week),
        team: r.team,
        offenseSnaps: toNum(r.offense_snaps),
        offensePct: toNullableNum(r.offense_pct),
      })
    );

  return { rows: mapped, fetchedAt, sourceUrl };
}

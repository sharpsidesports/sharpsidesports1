// server-only helper
// Weekly Next Gen Stats receiving data (separation, cushion, YAC above
// expectation) from nflverse's `nextgen_stats` release — already keyed by
// player_gsis_id, so no crosswalk join needed. File: ngs_receiving.csv.gz
//
// week === 0 rows are nflverse's season-aggregate rows (confirmed against
// live data), not a real week — filtered out here.

import { fetchNflverseGzipCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { NflverseNgsReceivingRow } from './types.js';

interface RawRow {
  season: string;
  season_type: string;
  week: string;
  player_gsis_id: string;
  avg_cushion: string;
  avg_separation: string;
  avg_intended_air_yards: string;
  catch_percentage: string;
  avg_yac: string;
  avg_expected_yac: string;
  avg_yac_above_expectation: string;
}

function toNullableNum(v: string | undefined): number | null {
  if (v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function fetchNgsReceiving(season: number): Promise<NflverseCsvResult<NflverseNgsReceivingRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseGzipCsv<RawRow>(
    'nextgen_stats',
    'ngs_receiving.csv.gz'
  );

  const mapped = rows
    .filter((r) => Number(r.season) === season && r.season_type === 'REG' && Number(r.week) > 0 && r.player_gsis_id)
    .map(
      (r): NflverseNgsReceivingRow => ({
        gsisId: r.player_gsis_id,
        season: Number(r.season),
        week: Number(r.week),
        avgCushion: toNullableNum(r.avg_cushion),
        avgSeparation: toNullableNum(r.avg_separation),
        avgIntendedAirYards: toNullableNum(r.avg_intended_air_yards),
        catchPercentage: toNullableNum(r.catch_percentage),
        avgYac: toNullableNum(r.avg_yac),
        avgExpectedYac: toNullableNum(r.avg_expected_yac),
        avgYacAboveExpectation: toNullableNum(r.avg_yac_above_expectation),
      })
    );

  return { rows: mapped, fetchedAt, sourceUrl };
}

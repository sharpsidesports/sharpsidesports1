// server-only helper
// Streams and aggregates the CURRENT season's play-by-play into per-player-
// per-week-per-zone touch counts. Deliberately current-season-only and
// streamed (never materializes the full ~150-200MB uncompressed CSV, or even
// one full row object per play, beyond what's needed to update the running
// aggregate) — see src/lib/tdModel/zoneConversionRates.ts for why league-wide
// historical PBP is computed offline instead of ingested here.

import { createGunzip } from 'zlib';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { zoneOf, type Zone } from '../tdModel/zoneConversionRates.js';

const PBP_BASE = 'https://github.com/nflverse/nflverse-data/releases/download/pbp';

export interface NflversePbpZoneRow {
  gsisId: string;
  season: number;
  week: number;
  zone: Zone;
  carries: number;
  targets: number;
  rushTds: number;
  recTds: number;
}

export async function fetchPbpZoneStats(season: number): Promise<NflversePbpZoneRow[]> {
  const url = `${PBP_BASE}/play_by_play_${season}.csv.gz`;
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch play-by-play for ${season}: HTTP ${res.status}`);
  }

  // key: gsisId|week|zone -> running counts
  const agg = new Map<string, NflversePbpZoneRow>();

  function bump(gsisId: string, week: number, zone: Zone, field: 'carries' | 'targets' | 'rushTds' | 'recTds') {
    const key = `${gsisId}|${week}|${zone}`;
    let row = agg.get(key);
    if (!row) {
      row = { gsisId, season, week, zone, carries: 0, targets: 0, rushTds: 0, recTds: 0 };
      agg.set(key, row);
    }
    row[field]++;
  }

  const nodeStream = Readable.fromWeb(res.body as any);
  const parser = parse({ columns: true, skip_empty_lines: true, relax_column_count: true });

  await new Promise<void>((resolve, reject) => {
    nodeStream
      .pipe(createGunzip())
      .pipe(parser)
      .on('data', (row: Record<string, string>) => {
        const yardline100 = Number(row.yardline_100);
        const week = Number(row.week);
        if (!Number.isFinite(yardline100) || !Number.isFinite(week)) return;
        if (row.qb_kneel === '1' || row.two_point_attempt === '1') return;

        const zone = zoneOf(yardline100);

        if (row.rush_attempt === '1' && row.rusher_player_id) {
          bump(row.rusher_player_id, week, zone, 'carries');
          if (row.rush_touchdown === '1') bump(row.rusher_player_id, week, zone, 'rushTds');
        } else if (row.pass_attempt === '1' && row.sack !== '1' && row.receiver_player_id) {
          bump(row.receiver_player_id, week, zone, 'targets');
          if (row.pass_touchdown === '1') bump(row.receiver_player_id, week, zone, 'recTds');
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  return Array.from(agg.values());
}

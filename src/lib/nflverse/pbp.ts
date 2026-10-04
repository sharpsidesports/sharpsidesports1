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

// Neutral-script pass-rate-over-expected, aggregated per team per week —
// see calculateTeamPassRateTrend.ts for why "neutral script" (offense win
// probability 0.1-0.9) matters: nflverse's own xpass/pass_oe columns are NOT
// pre-filtered to neutral situations (confirmed against live data — they're
// populated even in 4th-quarter blowouts), so without this filter garbage
// time would dilute exactly the signal this is meant to isolate.
export interface NflverseTeamPassRateRow {
  team: string;
  season: number;
  week: number;
  neutralPlays: number;
  passOeSum: number;
}

export interface PbpAggregates {
  zoneStats: NflversePbpZoneRow[];
  teamPassRateStats: NflverseTeamPassRateRow[];
}

export async function fetchPbpZoneStats(season: number): Promise<PbpAggregates> {
  const url = `${PBP_BASE}/play_by_play_${season}.csv.gz`;
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch play-by-play for ${season}: HTTP ${res.status}`);
  }

  // key: gsisId|week|zone -> running counts
  const agg = new Map<string, NflversePbpZoneRow>();
  // key: team|week -> running counts
  const passRateAgg = new Map<string, NflverseTeamPassRateRow>();

  function bump(gsisId: string, week: number, zone: Zone, field: 'carries' | 'targets' | 'rushTds' | 'recTds') {
    const key = `${gsisId}|${week}|${zone}`;
    let row = agg.get(key);
    if (!row) {
      row = { gsisId, season, week, zone, carries: 0, targets: 0, rushTds: 0, recTds: 0 };
      agg.set(key, row);
    }
    row[field]++;
  }

  function bumpPassRate(team: string, week: number, passOe: number) {
    const key = `${team}|${week}`;
    let row = passRateAgg.get(key);
    if (!row) {
      row = { team, season, week, neutralPlays: 0, passOeSum: 0 };
      passRateAgg.set(key, row);
    }
    row.neutralPlays += 1;
    row.passOeSum += passOe;
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

        if (
          (row.play_type === 'run' || row.play_type === 'pass') &&
          row.season_type === 'REG' &&
          row.posteam
        ) {
          const wp = Number(row.wp);
          const passOe = Number(row.pass_oe);
          if (Number.isFinite(wp) && wp >= 0.1 && wp <= 0.9 && Number.isFinite(passOe)) {
            bumpPassRate(row.posteam, week, passOe);
          }
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  return { zoneStats: Array.from(agg.values()), teamPassRateStats: Array.from(passRateAgg.values()) };
}

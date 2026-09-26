// One-off / periodically-rerun script: computes league-average TD-per-touch
// rates by field zone (Goal Line/Red Zone/Fringe/Open Field), separately for
// rush attempts and pass targets, from several full prior seasons of
// nflverse play-by-play. NOT part of the live app — the app reads the small
// resulting constants from src/lib/tdModel/zoneConversionRates.ts instead of
// re-fetching/re-processing full-season PBP (each season is ~19MB gzipped,
// ~150-200MB uncompressed) on every request or cron run.
//
// Run with: npx ts-node --esm scripts/computeZoneConversionRates.ts [seasons...]
// e.g.:     npx ts-node --esm scripts/computeZoneConversionRates.ts 2023 2024 2025
// Then hand-copy the printed rates into zoneConversionRates.ts.

import { createGunzip } from 'zlib';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

const PBP_BASE = 'https://github.com/nflverse/nflverse-data/releases/download/pbp';

type Zone = 'GOAL_LINE' | 'RED_ZONE' | 'FRINGE' | 'OPEN_FIELD';
const ZONES: Zone[] = ['GOAL_LINE', 'RED_ZONE', 'FRINGE', 'OPEN_FIELD'];

// Goal Line: <=5 yards from the end zone. Red Zone: 6-20. Fringe: 21-40.
// Open Field: 41+. Matches the zone breakout this model displays.
function zoneOf(yardline100: number): Zone {
  if (yardline100 <= 5) return 'GOAL_LINE';
  if (yardline100 <= 20) return 'RED_ZONE';
  if (yardline100 <= 40) return 'FRINGE';
  return 'OPEN_FIELD';
}

interface ZoneCounts {
  attempts: number;
  tds: number;
}

async function processSeason(
  season: number,
  rush: Record<Zone, ZoneCounts>,
  target: Record<Zone, ZoneCounts>
): Promise<void> {
  const url = `${PBP_BASE}/play_by_play_${season}.csv.gz`;
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const nodeStream = Readable.fromWeb(res.body as any);
  const parser = parse({ columns: true, skip_empty_lines: true, relax_column_count: true });

  await new Promise<void>((resolve, reject) => {
    nodeStream
      .pipe(createGunzip())
      .pipe(parser)
      .on('data', (row: Record<string, string>) => {
        const yardline100 = Number(row.yardline_100);
        if (!Number.isFinite(yardline100)) return;
        // Kneels and two-point-conversion plays aren't representative of a
        // normal scoring opportunity — exclude both.
        if (row.qb_kneel === '1' || row.two_point_attempt === '1') return;

        const zone = zoneOf(yardline100);
        if (row.rush_attempt === '1') {
          rush[zone].attempts++;
          if (row.rush_touchdown === '1') rush[zone].tds++;
        } else if (row.pass_attempt === '1' && row.sack !== '1' && row.receiver_player_id) {
          target[zone].attempts++;
          if (row.pass_touchdown === '1') target[zone].tds++;
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });
}

async function main() {
  const seasons = process.argv.slice(2).map(Number).filter(Number.isFinite);
  if (seasons.length === 0) {
    console.error('Usage: computeZoneConversionRates.ts <season> [season...]');
    process.exit(1);
  }

  const rush = Object.fromEntries(ZONES.map((z) => [z, { attempts: 0, tds: 0 }])) as Record<Zone, ZoneCounts>;
  const target = Object.fromEntries(ZONES.map((z) => [z, { attempts: 0, tds: 0 }])) as Record<Zone, ZoneCounts>;

  for (const season of seasons) {
    console.log(`Processing ${season}...`);
    await processSeason(season, rush, target);
  }

  console.log(`\nSeasons: ${seasons.join(', ')}`);
  console.log('\nRUSH_TD_RATE_BY_ZONE:');
  for (const z of ZONES) {
    const { attempts, tds } = rush[z];
    console.log(`  ${z}: attempts=${attempts} tds=${tds} rate=${(tds / attempts).toFixed(5)}`);
  }
  console.log('\nTARGET_TD_RATE_BY_ZONE:');
  for (const z of ZONES) {
    const { attempts, tds } = target[z];
    console.log(`  ${z}: attempts=${attempts} tds=${tds} rate=${(tds / attempts).toFixed(5)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

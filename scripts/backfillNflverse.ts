// One-off historical backfill: seeds Supabase with nflverse data for a
// range of past seasons so rolling metrics and future backtesting have
// something to query without re-fetching nflverse's CSVs every time.
// Requires SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY to be set (same env
// vars as src/lib/supabaseAdmin.ts).
//
// Run with: npx tsx scripts/backfillNflverse.ts 2021 2022 2023 2024 2025

import { ingestSeason, ingestPlayerCrosswalk } from '../src/lib/nflverse/ingest.js';

const seasons = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n));
if (seasons.length === 0) {
  console.error('Usage: npx tsx scripts/backfillNflverse.ts <season> [season...]');
  process.exit(1);
}

async function main() {
  console.log('Ingesting player crosswalk...');
  const crosswalk = await ingestPlayerCrosswalk();
  console.log(`  ${crosswalk.rows} rows.`);

  for (const season of seasons) {
    console.log(`\nIngesting season ${season}...`);
    const result = await ingestSeason(season);
    console.log(`  player-week rows: ${result.playerWeekRows}`);
    console.log(`  qb-week rows:     ${result.qbWeekRows}`);
    console.log(`  team-week rows:   ${result.teamWeekRows}`);
    console.log(`  injury rows:      ${result.injuryRows}`);
    if (result.errors.length > 0) console.log(`  errors: ${result.errors.join('; ')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

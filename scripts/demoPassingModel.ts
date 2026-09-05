// Demo/verification script: runs the QB passing model (Attempts/Yards Over
// Expected) against live ESPN projections + nflverse history + Vegas lines,
// and prints the full decomposition for a handful of real starting QBs.
//
// Run with: npx ts-node --esm scripts/demoPassingModel.ts [season] [week]

// loadLive.ts's fetches (unlike loadFromSupabase.ts) never touch Supabase,
// so nothing in its import chain triggers supabaseAdmin.ts's dotenv load —
// ODDS_API_KEY needs its own explicit bootstrap here for local runs.
import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

import { loadLivePassingProjectionsInput } from '../src/lib/passingModel/loadLive.js';
import { buildWeeklyPassingProjections } from '../src/lib/passingModel/buildWeeklyPassingProjections.js';

const season = Number(process.argv[2]) || 2026;
const week = Number(process.argv[3]) || 1;

const FOCUS_PLAYERS = ['Josh Allen', 'Patrick Mahomes', 'Jayden Daniels', 'Joe Burrow', 'Lamar Jackson'];

async function main() {
  console.log(`Loading ESPN week ${week}, ${season} QB projections + nflverse history + Vegas lines...`);
  const input = await loadLivePassingProjectionsInput(season, week);
  console.log(
    `Loaded: ${input.espnProjections.length} ESPN QBs, ${input.qbWeekStats.length} nflverse QB-week rows, ${input.teamWeekStats.length} team-week rows, ${input.gameLines.length} game-line rows, ${input.crosswalk.length} crosswalk rows, latestAvailableNflverseWeek=${JSON.stringify(input.latestAvailableNflverseWeek)}`
  );

  const results = buildWeeklyPassingProjections(input);
  console.log(`Computed ${results.length} QB projections (season=${season}, week=${week}).\n`);

  const focus = results.filter((r) => FOCUS_PLAYERS.includes(r.playerName));
  const shown = focus.length >= 3 ? focus : results.slice(0, 5);

  for (const r of shown) {
    console.log('='.repeat(70));
    console.log(`${r.playerName} (${r.team}) vs ${r.opponentTeam ?? '—'}${r.skipped ? `  [SKIPPED: ${r.skipped}]` : ''}`);
    console.log(`  ESPN projected attempts:           ${r.espnProjectedAttempts}`);
    console.log(`  ESPN projected passing yards:      ${r.espnProjectedPassingYards}`);
    console.log(`  Projected team pass attempts:      ${r.projectedTeamPassAttempts}`);
    console.log(`  Expected total plays:              ${r.expectedTotalPlays}`);
    console.log(`  Expected pass rate:                ${r.expectedPassRate}`);
    console.log(`  Expected attempts:                 ${r.expectedAttempts}`);
    console.log(`  >>> Attempts Over Expected:         ${r.attemptsOverExpected}`);
    console.log(`  Expected yards/attempt:             ${r.expectedYardsPerAttempt}`);
    console.log(`  Expected passing yards:             ${r.expectedPassingYards}`);
    console.log(`  Projected passing yards:            ${r.projectedPassingYards}`);
    console.log(`  >>> Yards Over Expected:             ${r.yardsOverExpected}`);
    console.log(`  Vegas spread / total:               ${r.vegasSpread} / ${r.vegasTotal}`);
    console.log(`  Confidence:                         ${r.confidence}`);
    console.log(`  Fallbacks used:                     ${JSON.stringify(r.fallbacksUsed)}`);
    console.log(`  Warnings:                           ${JSON.stringify(r.warnings)}`);
  }

  const vegasMissingCount = results.filter((r) => r.fallbacksUsed.includes('VEGAS_LINE_MISSING')).length;
  const rookieCount = results.filter((r) => r.fallbacksUsed.includes('ROOKIE_NO_HISTORY')).length;
  const unmatchedCount = results.filter((r) => r.warnings.includes('UNMATCHED_PLAYER')).length;
  const nanCount = results.filter(
    (r) =>
      (r.attemptsOverExpected !== null && !Number.isFinite(r.attemptsOverExpected)) ||
      (r.yardsOverExpected !== null && !Number.isFinite(r.yardsOverExpected))
  ).length;
  console.log('\nEdge-case coverage in this run:');
  console.log(`  Vegas line missing:                ${vegasMissingCount}`);
  console.log(`  Rookies / no-history fallback:     ${rookieCount}`);
  console.log(`  Unmatched ESPN<->nflverse players: ${unmatchedCount}`);
  console.log(`  NaN/non-finite outputs (bug check): ${nanCount}`);

  console.log('\nTop 10 by Attempts Over Expected:');
  const topAttempts = [...results]
    .filter((r) => !r.skipped)
    .sort((a, b) => (b.attemptsOverExpected ?? -999) - (a.attemptsOverExpected ?? -999))
    .slice(0, 10);
  for (const r of topAttempts) {
    console.log(
      `  ${String(r.attemptsOverExpected).padStart(6)}  ${r.playerName.padEnd(24)} ${r.team}  projAtt=${r.projectedTeamPassAttempts}  expAtt=${r.expectedAttempts}`
    );
  }

  console.log('\nTop 10 by Yards Over Expected:');
  const topYards = [...results]
    .filter((r) => !r.skipped)
    .sort((a, b) => (b.yardsOverExpected ?? -9999) - (a.yardsOverExpected ?? -9999))
    .slice(0, 10);
  for (const r of topYards) {
    console.log(
      `  ${String(r.yardsOverExpected).padStart(7)}  ${r.playerName.padEnd(24)} ${r.team}  projYds=${r.projectedPassingYards}  expYds=${r.expectedPassingYards}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

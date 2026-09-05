// Demo/verification script: runs the WR reception model against live ESPN
// week-1 2026 projections blended with nflverse's 2025 season history, and
// prints the full data-flow breakdown for a handful of real WRs.
//
// Run with: npx ts-node --esm scripts/demoReceptionModel.ts [season] [week]

import { loadLiveProjectionsInput } from '../src/lib/receptionModel/loadLive.js';
import { buildWeeklyReceptionProjections } from '../src/lib/receptionModel/buildWeeklyReceptionProjections.js';

const season = Number(process.argv[2]) || 2026;
const week = Number(process.argv[3]) || 1;

const FOCUS_PLAYERS = ["Ja'Marr Chase", 'Emeka Egbuka', 'Puka Nacua', 'Malik Nabers', 'Rome Odunze'];

async function main() {
  console.log(`Loading ESPN week ${week}, ${season} projections + nflverse history...`);
  const input = await loadLiveProjectionsInput(season, week);
  console.log(
    `Loaded: ${input.espnProjections.length} ESPN players, ${input.playerWeekStats.length} nflverse player-week rows, ${input.teamWeekStats.length} team-week rows, ${input.crosswalk.length} crosswalk rows, latestAvailableNflverseWeek=${JSON.stringify(input.latestAvailableNflverseWeek)}`
  );

  const results = buildWeeklyReceptionProjections(input);
  console.log(`Computed ${results.length} WR projections (season=${season}, week=${week}).\n`);

  const focus = results.filter((r) => FOCUS_PLAYERS.includes(r.playerName));
  const shown = focus.length >= 3 ? focus : results.slice(0, 5);

  for (const r of shown) {
    console.log('='.repeat(70));
    console.log(`${r.playerName} (${r.team})${r.skipped ? `  [SKIPPED: ${r.skipped}]` : ''}`);
    console.log(`  ESPN projected receptions:        ${r.espnProjectedReceptions}`);
    console.log(`  Expected target share:             ${r.expectedTargetShare}`);
    console.log(`  Projected team pass attempts:      ${r.projectedTeamPassAttempts}`);
    console.log(`  Projected targets:                 ${r.projectedTargets}`);
    console.log(`  Expected catch rate:                ${r.expectedCatchRate}`);
    console.log(`  nflverse model receptions:         ${r.nflverseProjectedReceptions}`);
    console.log(`  Final projected receptions (raw):  ${r.finalProjectedReceptionsRaw}`);
    console.log(`  >>> Projected Receptions:           ${r.projectedReceptions}`);
    console.log(`  >>> Reception Edge Score:           ${r.receptionEdgeScore}`);
    console.log(`  vs. ESPN:                           ${r.projectionDifference}`);
    console.log(`  Confidence:                         ${r.confidence}`);
    console.log(`  Fallbacks used:                     ${JSON.stringify(r.fallbacksUsed)}`);
    console.log(`  Warnings:                           ${JSON.stringify(r.warnings)}`);
  }

  const rookieCount = results.filter((r) => r.fallbacksUsed.includes('ROOKIE_NO_HISTORY')).length;
  const teamChangeCount = results.filter((r) => r.fallbacksUsed.includes('TEAM_CHANGE_DISCOUNTED_HISTORY')).length;
  const unmatchedCount = results.filter((r) => r.warnings.includes('UNMATCHED_PLAYER')).length;
  const espnOnlyCount = results.filter((r) => r.fallbacksUsed.includes('NFLVERSE_DATA_MISSING_ESPN_ONLY')).length;
  const nanCount = results.filter(
    (r) =>
      (r.projectedReceptions !== null && !Number.isFinite(r.projectedReceptions)) ||
      (r.receptionEdgeScore !== null && !Number.isFinite(r.receptionEdgeScore))
  ).length;
  console.log('\nEdge-case coverage in this run:');
  console.log(`  Rookies / no-history fallback:     ${rookieCount}`);
  console.log(`  Team-change discounted history:    ${teamChangeCount}`);
  console.log(`  ESPN-only (nflverse unavailable):  ${espnOnlyCount}`);
  console.log(`  Unmatched ESPN<->nflverse players: ${unmatchedCount}`);
  console.log(`  NaN/non-finite outputs (bug check): ${nanCount}`);

  const rookieExample = results.find((r) => r.fallbacksUsed.includes('ROOKIE_NO_HISTORY'));
  if (rookieExample) {
    console.log(`  Rookie example: ${rookieExample.playerName} -> projected=${rookieExample.projectedReceptions}, edge=${rookieExample.receptionEdgeScore}, confidence=${rookieExample.confidence}`);
  }
  const teamChangeExample = results.find((r) => r.fallbacksUsed.includes('TEAM_CHANGE_DISCOUNTED_HISTORY'));
  if (teamChangeExample) {
    console.log(`  Team-change example: ${teamChangeExample.playerName} (${teamChangeExample.team}) -> projected=${teamChangeExample.projectedReceptions}, confidence=${teamChangeExample.confidence}`);
  }

  console.log('\nTop 10 by Reception Edge Score:');
  const top10 = [...results].filter((r) => !r.skipped).sort((a, b) => (b.receptionEdgeScore ?? 0) - (a.receptionEdgeScore ?? 0)).slice(0, 10);
  for (const r of top10) {
    console.log(
      `  ${String(r.receptionEdgeScore).padStart(3)}  ${r.playerName.padEnd(24)} ${r.team}  proj=${r.projectedReceptions}  vsESPN=${r.projectionDifference}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

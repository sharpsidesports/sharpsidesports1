// Backtests the WR reception model against real historical outcomes.
//
// Important constraint discovered while building this (verified against
// live data, not assumed): ESPN's projections API only retains detailed
// historical per-week projected-stat blocks for the current/most-recent
// season — season-2 and older return no projected block at all. So this
// script always backtests the nflverse-only component (Steps 1-5) against
// real outcomes for any historical season/week, and additionally computes
// the ESPN-blended figure + "model vs. ESPN baseline" comparison only for
// the weeks where a historical ESPN projection is actually fetchable
// (skipped, not zero-filled, otherwise).
//
// Run with: npx tsx scripts/backtestReceptionModel.ts [season] [startWeek] [endWeek]
// Example:  npx tsx scripts/backtestReceptionModel.ts 2025 4 18
//   (starts at week 4 so every player has at least 3 prior games to build a
//   recency-weighted target share from)

import { getEspnWeekReceptionProjections } from '../src/lib/espnProjections.js';
import { fetchStatsPlayerWeek } from '../src/lib/nflverse/statsPlayerWeek.js';
import { fetchStatsTeamWeek } from '../src/lib/nflverse/statsTeamWeek.js';
import { fetchPlayerCrosswalk, buildEspnToGsisMap } from '../src/lib/nflverse/playerCrosswalk.js';
import { toNflverseTeamCode } from '../src/lib/nflverse/teamCodes.js';
import { calculateExpectedTargetShare } from '../src/lib/receptionModel/calculateExpectedTargetShare.js';
import { calculateExpectedCatchRate } from '../src/lib/receptionModel/calculateExpectedCatchRate.js';
import { calculateProjectedTeamPassAttempts } from '../src/lib/receptionModel/calculateProjectedTeamPassAttempts.js';
import { calculateProjectedTargets } from '../src/lib/receptionModel/calculateProjectedTargets.js';
import { calculateNFLVerseReceptions } from '../src/lib/receptionModel/calculateNFLVerseReceptions.js';
import { calculateProjectedReceptions } from '../src/lib/receptionModel/calculateProjectedReceptions.js';
import type { PlayerModelInput, PlayerGameLog, TeamGameLog } from '../src/lib/receptionModel/types.js';
import type { NflversePlayerWeekRow, NflverseTeamWeekRow } from '../src/lib/nflverse/types.js';

const season = Number(process.argv[2]) || 2025;
const startWeek = Number(process.argv[3]) || 4;
const endWeek = Number(process.argv[4]) || 18;
const priorSeason = season - 1;

interface Sample {
  actual: number;
  nflverseOnly: number | null;
  espnOnly: number | null;
  blended: number | null;
}

function toPlayerGameLog(r: NflversePlayerWeekRow): PlayerGameLog {
  return {
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponentTeam || null,
    targets: r.targets,
    receptions: r.receptions,
    targetShare: r.targetShare,
    receivingAirYards: r.receivingAirYards,
  };
}
function toTeamGameLog(r: NflverseTeamWeekRow): TeamGameLog {
  return { season: r.season, week: r.week, team: r.team, opponentTeam: r.opponentTeam || null, passAttempts: r.passAttempts };
}

function mae(samples: number[]): number {
  return samples.reduce((a, b) => a + Math.abs(b), 0) / samples.length;
}
function rmse(samples: number[]): number {
  return Math.sqrt(samples.reduce((a, b) => a + b * b, 0) / samples.length);
}
function mean(samples: number[]): number {
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}
function correlation(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

function report(label: string, actuals: number[], predictions: number[]) {
  const errors = predictions.map((p, i) => p - actuals[i]);
  console.log(
    `  ${label.padEnd(24)} n=${String(actuals.length).padEnd(5)} MAE=${mae(errors).toFixed(3)}  RMSE=${rmse(errors).toFixed(3)}  bias=${mean(errors).toFixed(3)}  corr=${correlation(actuals, predictions).toFixed(3)}`
  );
}

async function main() {
  console.log(`Backtesting WR reception model: season=${season}, weeks ${startWeek}-${endWeek}`);
  console.log(`(prior season for early-week regression: ${priorSeason})\n`);

  const [{ rows: seasonRows }, { rows: priorRows }, { rows: teamSeasonRows }, { rows: teamPriorRows }, crosswalkRes] =
    await Promise.all([
      fetchStatsPlayerWeek(season),
      fetchStatsPlayerWeek(priorSeason).catch(() => ({ rows: [] as NflversePlayerWeekRow[] })),
      fetchStatsTeamWeek(season),
      fetchStatsTeamWeek(priorSeason).catch(() => ({ rows: [] as NflverseTeamWeekRow[] })),
      fetchPlayerCrosswalk(),
    ]);

  const espnToGsis = buildEspnToGsisMap(crosswalkRes.rows);
  const gsisToEspn = new Map<string, string>();
  for (const [espnId, gsisId] of espnToGsis) gsisToEspn.set(gsisId, espnId);

  const allPlayerRows = [...seasonRows, ...priorRows];
  const allTeamRows = [...teamSeasonRows, ...teamPriorRows];

  const nflverseSamples: number[] = [];
  const nflversePreds: number[] = [];
  const blendedSamples: number[] = [];
  const blendedPreds: number[] = [];
  const espnSamples: number[] = [];
  const espnPreds: number[] = [];

  let weeksWithEspnHistory = 0;

  for (let week = startWeek; week <= endWeek; week++) {
    const actualsThisWeek = seasonRows.filter((r) => r.week === week);
    if (actualsThisWeek.length === 0) continue;

    let espnByGsis: Map<string, number> | null = null;
    try {
      const espnWeek = await getEspnWeekReceptionProjections(season, week);
      if (espnWeek.players.length > 0) {
        const m = new Map<string, number>();
        for (const p of espnWeek.players) {
          const gsisId = espnToGsis.get(p.espn_id);
          if (gsisId) m.set(gsisId, p.projectedReceptions);
        }
        if (m.size > 0) {
          espnByGsis = m;
          weeksWithEspnHistory++;
        }
      }
    } catch {
      // ESPN historical data unavailable for this season/week — proceed nflverse-only
    }

    for (const actualRow of actualsThisWeek) {
      const gsisId = actualRow.gsisId;
      const team = actualRow.team;
      const opponentTeam = actualRow.opponentTeam || null;

      const currentSeasonGames = allPlayerRows
        .filter((r) => r.gsisId === gsisId && r.season === season && r.week < week)
        .sort((a, b) => a.week - b.week)
        .map(toPlayerGameLog);
      const priorSeasonGames = allPlayerRows
        .filter((r) => r.gsisId === gsisId && r.season === priorSeason)
        .sort((a, b) => a.week - b.week)
        .map(toPlayerGameLog);

      if (currentSeasonGames.length === 0 && priorSeasonGames.length === 0) continue; // true rookie, nothing to backtest here

      const currentTeamGames = allTeamRows
        .filter((r) => r.team === team && r.season === season && r.week < week)
        .sort((a, b) => a.week - b.week)
        .map(toTeamGameLog);
      const priorTeamGames = allTeamRows
        .filter((r) => r.team === team && r.season === priorSeason)
        .sort((a, b) => a.week - b.week)
        .map(toTeamGameLog);
      const opponentGamesAllowed = opponentTeam
        ? allTeamRows.filter((r) => r.opponentTeam === opponentTeam && (r.season === season || r.season === priorSeason)).map(toTeamGameLog)
        : [];

      const lastPriorTeam = priorSeasonGames.length > 0 ? priorSeasonGames[priorSeasonGames.length - 1].team : null;
      const isTeamChangeThisSeason = lastPriorTeam !== null && lastPriorTeam !== team;

      const model: PlayerModelInput = {
        gsisId,
        espnId: gsisToEspn.get(gsisId) ?? '',
        playerName: actualRow.playerName,
        team,
        position: 'WR',
        opponentTeam,
        currentSeasonGames,
        priorSeasonGames,
        currentTeamGames,
        priorTeamGames,
        opponentGamesAllowed,
        espnProjectedReceptions: espnByGsis?.get(gsisId) ?? null,
        isRookie: false,
        isTeamChangeThisSeason,
        qbChanged: false,
        injuryReportStatus: null,
        isOnBye: false,
        nflverseDataFetchedAt: null,
      };

      const targetShare = calculateExpectedTargetShare(model);
      const catchRate = calculateExpectedCatchRate(model);
      const passAttempts = calculateProjectedTeamPassAttempts(model.currentTeamGames, model.priorTeamGames, model.opponentGamesAllowed);
      const projectedTargets = calculateProjectedTargets(passAttempts.projectedTeamPassAttempts, targetShare.value);
      const nflverseReceptions = calculateNFLVerseReceptions(projectedTargets, catchRate.expectedCatchRate);

      const actual = actualRow.receptions;

      if (nflverseReceptions !== null) {
        nflverseSamples.push(actual);
        nflversePreds.push(nflverseReceptions);
      }

      if (model.espnProjectedReceptions !== null) {
        espnSamples.push(actual);
        espnPreds.push(model.espnProjectedReceptions);

        const blend = calculateProjectedReceptions(model.espnProjectedReceptions, nflverseReceptions);
        if (blend.finalProjectedReceptionsRaw !== null) {
          blendedSamples.push(actual);
          blendedPreds.push(blend.finalProjectedReceptionsRaw);
        }
      }
    }
  }

  console.log(`Weeks with fetchable ESPN historical projections: ${weeksWithEspnHistory} of ${endWeek - startWeek + 1}\n`);
  console.log('Results (lower MAE/RMSE better, bias near 0 better, correlation higher better):');
  if (nflverseSamples.length > 0) report('nflverse-only model', nflverseSamples, nflversePreds);
  if (espnSamples.length > 0) report('ESPN baseline alone', espnSamples, espnPreds);
  if (blendedSamples.length > 0) report('Blended (70/30) model', blendedSamples, blendedPreds);

  if (espnSamples.length === 0) {
    console.log(
      '\nNo ESPN historical projections were fetchable for this season/week range — ESPN-baseline and blended comparisons were skipped. This is a real limitation of ESPN\'s API (it does not retain detailed historical projected-stat blocks beyond the current/most recent season), not a bug.'
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

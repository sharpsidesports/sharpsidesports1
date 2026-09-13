// Backtests the QB passing model's NON-VEGAS components against real
// historical outcomes: the pace-based projected team pass attempts (reused
// from the reception model), the context-only expected attempts (pace +
// opponent funnel, gameLine forced to null so no Vegas signal is used —
// this is the only way to backtest this component at all right now: The
// Odds API's free tier has no historical spread/total endpoint, so there is
// no historical Vegas data to backtest against), and expected yards/attempt
// (own recency-weighted Y/A regressed toward baseline, blended with
// opponent yards-allowed-per-attempt).
//
// Same historical-ESPN-projections constraint as backtestReceptionModel.ts:
// ESPN's API only retains detailed per-week projected-stat blocks for the
// current/most-recent season, so the ESPN-baseline comparison is skipped
// for older seasons (skipped, not zero-filled).
//
// Run with: npx tsx scripts/backtestPassingModel.ts [season] [startWeek] [endWeek]
// Example:  npx tsx scripts/backtestPassingModel.ts 2025 4 18

import { getEspnWeekPassingProjections } from '../src/lib/espnProjections.js';
import { fetchStatsQbWeek } from '../src/lib/nflverse/statsQbWeek.js';
import { fetchStatsTeamWeek } from '../src/lib/nflverse/statsTeamWeek.js';
import { fetchPlayerCrosswalk, buildEspnToGsisMap } from '../src/lib/nflverse/playerCrosswalk.js';
import { calculateProjectedTeamPassAttempts } from '../src/lib/receptionModel/calculateProjectedTeamPassAttempts.js';
import { calculateExpectedTotalPlays } from '../src/lib/passingModel/calculateExpectedTotalPlays.js';
import { calculateExpectedPassRate } from '../src/lib/passingModel/calculateExpectedPassRate.js';
import { calculateExpectedAttempts } from '../src/lib/passingModel/calculateExpectedAttempts.js';
import { calculateExpectedYardsPerAttempt } from '../src/lib/passingModel/calculateExpectedYardsPerAttempt.js';
import type { QbGameLog, TeamPassingGameLog } from '../src/lib/passingModel/types.js';
import type { NflverseQbWeekRow, NflverseTeamWeekRow } from '../src/lib/nflverse/types.js';

const season = Number(process.argv[2]) || 2025;
const startWeek = Number(process.argv[3]) || 4;
const endWeek = Number(process.argv[4]) || 18;
const priorSeason = season - 1;

function toQbGameLog(r: NflverseQbWeekRow): QbGameLog {
  return { season: r.season, week: r.week, team: r.team, opponentTeam: r.opponentTeam || null, attempts: r.attempts, passingYards: r.passingYards };
}
function toTeamPassingGameLog(r: NflverseTeamWeekRow): TeamPassingGameLog {
  return {
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponentTeam || null,
    passAttempts: r.passAttempts,
    carries: r.carries,
    passingYards: r.passingYards,
  };
}

function mae(errors: number[]): number {
  return errors.reduce((a, b) => a + Math.abs(b), 0) / errors.length;
}
function rmse(errors: number[]): number {
  return Math.sqrt(errors.reduce((a, b) => a + b * b, 0) / errors.length);
}
function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
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
    `  ${label.padEnd(32)} n=${String(actuals.length).padEnd(5)} MAE=${mae(errors).toFixed(2)}  RMSE=${rmse(errors).toFixed(2)}  bias=${mean(errors).toFixed(2)}  corr=${correlation(actuals, predictions).toFixed(3)}`
  );
}

async function main() {
  console.log(`Backtesting QB passing model (non-Vegas components): season=${season}, weeks ${startWeek}-${endWeek}`);
  console.log(`(prior season for early-week regression: ${priorSeason})\n`);

  const [{ rows: seasonRows }, { rows: priorRows }, { rows: teamSeasonRows }, { rows: teamPriorRows }, crosswalkRes] =
    await Promise.all([
      fetchStatsQbWeek(season),
      fetchStatsQbWeek(priorSeason).catch(() => ({ rows: [] as NflverseQbWeekRow[] })),
      fetchStatsTeamWeek(season),
      fetchStatsTeamWeek(priorSeason).catch(() => ({ rows: [] as NflverseTeamWeekRow[] })),
      fetchPlayerCrosswalk(),
    ]);

  const espnToGsis = buildEspnToGsisMap(crosswalkRes.rows);

  const allQbRows = [...seasonRows, ...priorRows];
  const allTeamRows = [...teamSeasonRows, ...teamPriorRows];

  const attemptsActuals: number[] = [];
  const attemptsPacePreds: number[] = []; // projectedTeamPassAttempts (pace-based, reused calc)
  const attemptsContextPreds: number[] = []; // expectedAttempts w/ gameLine=null (pace + opponent funnel, no Vegas)
  const attemptsEspnActuals: number[] = [];
  const attemptsEspnPreds: number[] = [];

  const yardsActuals: number[] = [];
  const yardsPreds: number[] = []; // projectedTeamPassAttempts x expectedYardsPerAttempt
  const yardsEspnActuals: number[] = [];
  const yardsEspnPreds: number[] = [];

  let weeksWithEspnHistory = 0;

  for (let week = startWeek; week <= endWeek; week++) {
    const actualsThisWeek = seasonRows.filter((r) => r.week === week && r.attempts >= 10); // exclude garbage-time/emergency-relief snaps, not real starts
    if (actualsThisWeek.length === 0) continue;

    let espnByGsis: Map<string, { attempts: number; yards: number }> | null = null;
    try {
      const espnWeek = await getEspnWeekPassingProjections(season, week);
      if (espnWeek.players.length > 0) {
        const m = new Map<string, { attempts: number; yards: number }>();
        for (const p of espnWeek.players) {
          const gsisId = espnToGsis.get(p.espn_id);
          if (gsisId) m.set(gsisId, { attempts: p.projectedAttempts, yards: p.projectedPassingYards });
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

      const currentSeasonGames = allQbRows
        .filter((r) => r.gsisId === gsisId && r.season === season && r.week < week)
        .sort((a, b) => a.week - b.week)
        .map(toQbGameLog);
      const priorSeasonGames = allQbRows
        .filter((r) => r.gsisId === gsisId && r.season === priorSeason)
        .sort((a, b) => a.week - b.week)
        .map(toQbGameLog);

      if (currentSeasonGames.length === 0 && priorSeasonGames.length === 0) continue; // true rookie, nothing to backtest here

      const currentTeamGames = allTeamRows
        .filter((r) => r.team === team && r.season === season && r.week < week)
        .sort((a, b) => a.week - b.week)
        .map(toTeamPassingGameLog);
      const priorTeamGames = allTeamRows
        .filter((r) => r.team === team && r.season === priorSeason)
        .sort((a, b) => a.week - b.week)
        .map(toTeamPassingGameLog);
      const opponentGamesAllowed = opponentTeam
        ? allTeamRows
            .filter((r) => r.opponentTeam === opponentTeam && (r.season === season || r.season === priorSeason))
            .map(toTeamPassingGameLog)
        : [];

      const passAttempts = calculateProjectedTeamPassAttempts(currentTeamGames, priorTeamGames, opponentGamesAllowed);
      const totalPlays = calculateExpectedTotalPlays(currentTeamGames, priorTeamGames, opponentGamesAllowed, null);
      const passRate = calculateExpectedPassRate(opponentGamesAllowed, null);
      const expectedAttempts = calculateExpectedAttempts(totalPlays.expectedTotalPlays, passRate.expectedPassRate);
      const ypa = calculateExpectedYardsPerAttempt(currentSeasonGames, priorSeasonGames, opponentGamesAllowed);

      const actualAttempts = actualRow.attempts;
      const actualYards = actualRow.passingYards;

      if (passAttempts.projectedTeamPassAttempts !== null) {
        attemptsActuals.push(actualAttempts);
        attemptsPacePreds.push(passAttempts.projectedTeamPassAttempts);
        attemptsContextPreds.push(expectedAttempts ?? passAttempts.projectedTeamPassAttempts);

        if (ypa.expectedYardsPerAttempt !== null) {
          yardsActuals.push(actualYards);
          yardsPreds.push(passAttempts.projectedTeamPassAttempts * ypa.expectedYardsPerAttempt);
        }
      }

      const espn = espnByGsis?.get(gsisId);
      if (espn) {
        attemptsEspnActuals.push(actualAttempts);
        attemptsEspnPreds.push(espn.attempts);
        yardsEspnActuals.push(actualYards);
        yardsEspnPreds.push(espn.yards);
      }
    }
  }

  console.log(`Weeks with fetchable ESPN historical projections: ${weeksWithEspnHistory} of ${endWeek - startWeek + 1}\n`);

  console.log('ATTEMPTS (lower MAE/RMSE better, bias near 0 better, correlation higher better):');
  if (attemptsPacePreds.length > 0) report('Pace-based (Projected Team Att.)', attemptsActuals, attemptsPacePreds);
  if (attemptsContextPreds.length > 0) report('Context-only Expected Attempts', attemptsActuals, attemptsContextPreds);
  if (attemptsEspnPreds.length > 0) report('ESPN baseline alone', attemptsEspnActuals, attemptsEspnPreds);

  console.log('\nPASSING YARDS:');
  if (yardsPreds.length > 0) report('Attempts x Expected YPA', yardsActuals, yardsPreds);
  if (yardsEspnPreds.length > 0) report('ESPN baseline alone', yardsEspnActuals, yardsEspnPreds);

  if (attemptsEspnPreds.length === 0) {
    console.log(
      "\nNo ESPN historical projections were fetchable for this season/week range — ESPN-baseline comparisons were skipped. This is a real limitation of ESPN's API (it does not retain detailed historical projected-stat blocks beyond the current/most recent season), not a bug."
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

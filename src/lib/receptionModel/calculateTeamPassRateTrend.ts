// Team-level pass-rate-over-expected (PROE) trend: compares a team's last-3-
// week neutral-script pass tendency against its season-to-date tendency.
//
// calculateProjectedTeamPassAttempts.ts projects next week's pass attempts
// from 60% the team's own raw recent attempts + 40% opponent allowed — pure
// historical volume, no game-script adjustment. So when a team's recent
// games happened to be blowouts (garbage-time clock-killing suppressing real
// pass attempts, or garbage-time passing inflating them), that recent raw
// average is a distorted sample and the projection built on it is too. This
// flags that distortion directly: a big gap between recent and season PROE
// means the recent raw-attempts sample probably doesn't reflect the team's
// real tendency, independent of why we're computing receptions downstream.

export interface TeamWeekPassRateRow {
  week: number;
  neutralPlays: number;
  passOeSum: number;
}

export interface TeamPassRateTrendResult {
  recentProe: number | null;
  seasonProe: number | null;
  recentNeutralPlays: number;
}

const RECENT_WEEKS_WINDOW = 3;
// Roughly one game's worth of neutral-script snaps — below this the recent
// PROE average is too noisy to trust.
const MIN_NEUTRAL_PLAYS = 20;

// nflverse's per-play pass_oe is on a 0-100 percentage-point scale (verified
// against live data: a completed pass with xpass=0.453 has pass_oe=54.65,
// i.e. (1 - xpass) * 100; a run with xpass=0.403 has pass_oe=-40.28, i.e.
// -xpass * 100 — individual plays are necessarily extreme, only the average
// across many plays converges to a sane team-level number). Dividing by 100
// here converts that average to the same 0-1 fraction scale every other
// rate/share field in this codebase uses (formatPct, percentileRank, etc.),
// so downstream thresholds and formatting don't need special-casing.
function weightedAverage(rows: TeamWeekPassRateRow[]): number | null {
  const totalPlays = rows.reduce((sum, r) => sum + r.neutralPlays, 0);
  if (totalPlays === 0) return null;
  const totalPassOe = rows.reduce((sum, r) => sum + r.passOeSum, 0);
  return totalPassOe / totalPlays / 100;
}

export function calculateTeamPassRateTrend(teamWeeks: TeamWeekPassRateRow[]): TeamPassRateTrendResult {
  const sorted = [...teamWeeks].sort((a, b) => a.week - b.week);
  const recentWeeks = sorted.slice(-RECENT_WEEKS_WINDOW);
  const recentNeutralPlays = recentWeeks.reduce((sum, r) => sum + r.neutralPlays, 0);

  return {
    recentProe: recentNeutralPlays >= MIN_NEUTRAL_PLAYS ? weightedAverage(recentWeeks) : null,
    seasonProe: weightedAverage(sorted),
    recentNeutralPlays,
  };
}

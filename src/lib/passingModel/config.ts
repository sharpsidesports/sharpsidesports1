// Single source of truth for every tunable weight in the QB passing model
// (Attempts Over Expected / Yards Over Expected). Same "starting values, not
// fit to data yet" spirit as receptionModel/config.ts.

export const PASSING_MODEL_WEIGHTS = {
  // Expected Total Plays: blend of own-team pace and opponent's pace allowed.
  OWN_PACE_WEIGHT: 0.5,
  OPPONENT_PACE_WEIGHT: 0.5,

  // Expected Yards Per Attempt: blend of the QB's own (shrunk) Y/A and the
  // opponent's yards-allowed-per-attempt — matches the 60/40 own/opponent
  // split already established as this app's house convention in
  // calculateProjectedTeamPassAttempts.
  OWN_YPA_WEIGHT: 0.6,
  OPPONENT_YPA_ALLOWED_WEIGHT: 0.4,
} as const;

export const PASSING_REGRESSION = {
  // Expected Total Plays: Vegas total nudge on top of the pace blend.
  LEAGUE_AVG_VEGAS_TOTAL: 44, // typical NFL game o/u, points
  PLAYS_PER_TOTAL_POINT: 0.15, // extra total-game plays per point of total above league avg
  MAX_PACE_ADJUSTMENT: 6, // plays

  // Expected Pass Rate: league baseline adjusted for game script + opponent funnel.
  LEAGUE_BASE_PASS_RATE: 0.58,
  SCRIPT_SENSITIVITY: 0.01, // pass-rate shift per point of this team's spread (positive spread = underdog = more pass-rate)
  MAX_SCRIPT_ADJUSTMENT: 0.08,
  OPPONENT_FUNNEL_WEIGHT: 0.3, // how much opponent's allowed-pass-rate deviation from league average counts
  MIN_PASS_RATE: 0.45,
  MAX_PASS_RATE: 0.72,

  // Expected Yards Per Attempt: Bayesian shrinkage toward a league baseline.
  BASELINE_YARDS_PER_ATTEMPT: 7.0,
  YPA_REGRESSION_ATTEMPTS: 100, // much higher than receptions' catch-rate constant (20) — Y/A is noisier per-attempt than catch rate is per-target
} as const;

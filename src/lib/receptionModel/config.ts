// Single source of truth for every tunable weight in the WR reception
// model. Change these to backtest different configurations — nothing else
// in the model layer should hardcode a weight value.
//
// Naming note: the original spec called these YAHOO_* — this app has no
// Yahoo integration, so ESPN's live fantasy projections (src/lib/espnProjections.ts)
// serve as the baseline prior instead. Same role, same starting values.

export const MODEL_WEIGHTS = {
  // Step 1 — recency-weighted target share blend. Must sum to 1.0; the
  // model dynamically redistributes these when fewer than 3/5 current-season
  // games exist rather than assuming missing games are zero.
  RECENT_3_WEIGHT: 0.5,
  RECENT_5_WEIGHT: 0.3,
  SEASON_WEIGHT: 0.2,

  // Step 6 — blend of the ESPN baseline prior and the from-scratch nflverse
  // model into the final projected receptions figure.
  ESPN_PROJECTION_WEIGHT: 0.7,
  NFLVERSE_MODEL_WEIGHT: 0.3,

  // Part 2 — Reception Edge Score component weights (applied to min-max
  // normalized values within the current WR pool).
  EDGE_ESPN_WEIGHT: 0.7,
  EDGE_TARGET_VOLUME_WEIGHT: 0.2,
  EDGE_TARGET_SHARE_WEIGHT: 0.1,
} as const;

export type ModelWeights = typeof MODEL_WEIGHTS;

// Regression targets used when a player's own sample is too small to trust
// on its own (rookies, tiny target counts, early season). These are
// deliberately simple starting values, not fit to data yet.
export const REGRESSION = {
  // League-average-ish WR catch rate used as the "prior" that small samples
  // regress toward.
  BASELINE_CATCH_RATE: 0.65,
  // How many targets a player needs before their own catch rate is trusted
  // at close to full weight (a small-sample regression strength constant —
  // higher = more regression toward the baseline for a given sample size).
  CATCH_RATE_REGRESSION_TARGETS: 20,
  // Confidence discount applied to a player's historical target share after
  // a team change, before it's blended into calculateExpectedTargetShare.
  TEAM_CHANGE_TARGET_SHARE_DISCOUNT: 0.4,

  // aDOT (receiving_air_yards / targets) supporting variable for
  // calculateExpectedCatchRate — deeper average target depth nudges catch
  // rate down, shorter aDOT nudges it up. Deliberately a small effect: this
  // is a supporting signal, not a primary driver, per the spec.
  LEAGUE_AVG_ADOT: 9.0,
  ADOT_CATCH_RATE_SENSITIVITY: 0.006, // catch-rate points per yard of aDOT deviation
  ADOT_MAX_ADJUSTMENT: 0.05,
} as const;

// Sanity bounds on the final expected catch rate — keeps a tiny/noisy sample
// or an aDOT adjustment from producing a degenerate 0% or 100%.
export const CATCH_RATE_BOUNDS = { min: 0.3, max: 0.95 } as const;

// How stale nflverse data is allowed to be (in weeks behind the expected
// current week) before checkNFLVerseFreshness() raises NFLVERSE_DATA_STALE.
export const FRESHNESS_MAX_WEEKS_BEHIND = 1;

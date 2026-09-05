// Verifies ingested nflverse data actually belongs to the expected
// season/week before it's blended into a projection. The ESPN-only
// projection still works independently if this fails — nflverse being
// stale/missing never blocks a projection, it just narrows it to ESPN alone
// and surfaces a warning.

import { FRESHNESS_MAX_WEEKS_BEHIND } from './config.js';
import type { WarningReason } from './types.js';

export interface FreshnessResult {
  isFresh: boolean;
  warnings: WarningReason[];
}

// `latestAvailable` is the most recent (season, week) nflverse actually has
// data for right now (e.g. the last fully-played week). `expected` is the
// week we're projecting.
//
// Week 1 of a season is a special case: nflverse legitimately has no
// current-season data yet, and the most recent prior season is exactly the
// right fallback — that is NOT staleness, it's the designed early-season
// path (see recencyWeightedBlend). Staleness is specifically about nflverse
// lagging behind where it *should* be once the season it's projecting is
// already underway.
export function checkNFLVerseFreshness(
  expected: { season: number; week: number },
  latestAvailable: { season: number; week: number; fetchedAt: string } | null
): FreshnessResult {
  if (latestAvailable === null) {
    return { isFresh: false, warnings: ['NFLVERSE_DATA_STALE'] };
  }

  if (expected.week <= 1) {
    // Nothing from the current season can exist yet — fresh as long as we
    // have at most one full season's worth of gap (i.e. last season's data).
    const isFresh = latestAvailable.season >= expected.season - 1;
    return isFresh ? { isFresh: true, warnings: [] } : { isFresh: false, warnings: ['NFLVERSE_DATA_STALE'] };
  }

  // Week 2+: the current season is underway, so we expect nflverse to have
  // caught up to (at worst) FRESHNESS_MAX_WEEKS_BEHIND weeks ago within the
  // same season. Still being on the prior season here means the pipeline is
  // genuinely behind.
  if (latestAvailable.season !== expected.season) {
    return { isFresh: false, warnings: ['NFLVERSE_DATA_STALE'] };
  }
  const weeksBehind = expected.week - latestAvailable.week;
  if (weeksBehind > FRESHNESS_MAX_WEEKS_BEHIND) {
    return { isFresh: false, warnings: ['NFLVERSE_DATA_STALE'] };
  }
  return { isFresh: true, warnings: [] };
}

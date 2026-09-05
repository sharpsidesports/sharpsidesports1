// Shared recency-weighted blending engine used by both
// calculateExpectedTargetShare and calculateExpectedCatchRate. Kept as one
// implementation so the "last-3 / last-5 / season" weighting system (and its
// early-season / team-change fallback behavior) only needs to change in one
// place when backtesting different configurations.

import { MODEL_WEIGHTS, REGRESSION } from './config.js';
import type { FallbackReason } from './types.js';

export interface RecencyBlendResult {
  value: number | null;
  fallbacksUsed: FallbackReason[];
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

interface Level {
  weight: number;
  value: number | null;
}

// currentSeasonValues / priorSeasonValues are per-game metric values already
// extracted by the caller (e.g. weekly target share, or weekly catch rate),
// ordered ascending by week, with `null` for any game where the metric
// couldn't be computed (never a fabricated 0).
export function recencyWeightedBlend(
  currentSeasonValues: (number | null)[],
  priorSeasonValues: (number | null)[],
  isTeamChangeThisSeason: boolean
): RecencyBlendResult {
  const fallbacksUsed: FallbackReason[] = [];
  const n = currentSeasonValues.length;
  const recent3 = currentSeasonValues.slice(-3).filter((v): v is number => v !== null);
  const recent5 = currentSeasonValues.slice(-5).filter((v): v is number => v !== null);
  const season = currentSeasonValues.filter((v): v is number => v !== null);

  const levels: Level[] = [
    { weight: MODEL_WEIGHTS.RECENT_3_WEIGHT, value: n >= 3 ? average(recent3) : null },
    { weight: MODEL_WEIGHTS.RECENT_5_WEIGHT, value: n >= 5 ? average(recent5) : null },
    { weight: MODEL_WEIGHTS.SEASON_WEIGHT, value: n >= 1 ? average(season) : null },
  ];

  const available = levels.filter((l) => l.value !== null);
  const unavailableWeight = levels.filter((l) => l.value === null).reduce((a, l) => a + l.weight, 0);

  const priorSeasonValue = average(priorSeasonValues.filter((v): v is number => v !== null));
  let priorSeasonWeight = 0;

  if (unavailableWeight > 0) {
    if (priorSeasonValue !== null) {
      priorSeasonWeight = unavailableWeight;
      if (isTeamChangeThisSeason) {
        // Discount the old-team signal; hand the discounted-away weight back
        // to whatever current-team levels ARE available this season.
        const discounted = priorSeasonWeight * REGRESSION.TEAM_CHANGE_TARGET_SHARE_DISCOUNT;
        const freed = priorSeasonWeight - discounted;
        priorSeasonWeight = discounted;
        if (available.length > 0) {
          const bonus = freed / available.length;
          for (const l of available) l.weight += bonus;
        } else {
          priorSeasonWeight += freed; // nothing else to give it to
        }
        fallbacksUsed.push('TEAM_CHANGE_DISCOUNTED_HISTORY');
      }
      fallbacksUsed.push('EARLY_SEASON_PRIOR_SEASON_REGRESSION');
    } else if (available.length > 0) {
      // No prior season to lean on — redistribute proportionally across
      // whatever current-season levels ARE available.
      const totalAvailableWeight = available.reduce((a, l) => a + l.weight, 0);
      for (const l of available) l.weight += unavailableWeight * (l.weight / totalAvailableWeight);
    } else {
      fallbacksUsed.push('NO_PRIOR_SEASON_DATA');
    }
  }

  const components: { weight: number; value: number }[] = available.map((l) => ({
    weight: l.weight,
    value: l.value as number,
  }));
  if (priorSeasonWeight > 0 && priorSeasonValue !== null) {
    components.push({ weight: priorSeasonWeight, value: priorSeasonValue });
  }

  if (components.length === 0) {
    fallbacksUsed.push('ROOKIE_NO_HISTORY');
    return { value: null, fallbacksUsed };
  }

  const totalWeight = components.reduce((a, c) => a + c.weight, 0);
  const value = components.reduce((a, c) => a + c.weight * c.value, 0) / totalWeight;

  return { value, fallbacksUsed };
}

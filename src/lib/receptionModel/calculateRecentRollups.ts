// Recent-games rollups — raw observed target share / catch rate over the
// last min(3, n) actually-played games, paired against the season-long raw
// average target share. Unlike calculateReceptionDebt (season-cumulative,
// diluted by a player's early-season role once that role changes) and
// expectedTargetShare/expectedCatchRate (model blends/shrinks toward a
// prior), these are plain recent-observed numbers — "what's actually been
// happening lately" — used to detect current role/efficiency and role
// trend without being defeated by a mid-season role change.

import type { PlayerGameLog } from './types.js';

const RECENT_WINDOW = 3;

export interface RecentRollups {
  recentTargetShare: number | null;
  recentCatchPct: number | null;
  seasonTargetShareActual: number | null;
  recentGamesCount: number;
  recentTargets: number; // raw target count over the recent window — lets callers gate signals on sample size (a 1-target/1-catch game is not a real 100% catch rate)
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// Target share average over the last `window` games — used for the Role
// Climbing/Fading trend specifically, which compares against season average
// on a shorter, more reactive window than the main recent rollups above.
export interface TargetShareWindowResult {
  targetShare: number | null;
  gamesCount: number;
}

export function calculateTargetShareWindow(
  currentSeasonGames: PlayerGameLog[],
  window: number
): TargetShareWindowResult {
  const games = currentSeasonGames.slice(-window);
  const shares = games.map((g) => g.targetShare).filter((v): v is number => v !== null);
  return { targetShare: average(shares), gamesCount: games.length };
}

export function calculateRecentRollups(currentSeasonGames: PlayerGameLog[]): RecentRollups {
  if (currentSeasonGames.length === 0) {
    return {
      recentTargetShare: null,
      recentCatchPct: null,
      seasonTargetShareActual: null,
      recentGamesCount: 0,
      recentTargets: 0,
    };
  }

  const recentGames = currentSeasonGames.slice(-RECENT_WINDOW);

  const recentShares = recentGames.map((g) => g.targetShare).filter((v): v is number => v !== null);
  const recentTargets = recentGames.reduce((sum, g) => sum + g.targets, 0);
  const recentReceptions = recentGames.reduce((sum, g) => sum + g.receptions, 0);

  const seasonShares = currentSeasonGames.map((g) => g.targetShare).filter((v): v is number => v !== null);

  return {
    recentTargetShare: average(recentShares),
    recentCatchPct: recentTargets > 0 ? recentReceptions / recentTargets : null,
    seasonTargetShareActual: average(seasonShares),
    recentGamesCount: recentGames.length,
    recentTargets,
  };
}

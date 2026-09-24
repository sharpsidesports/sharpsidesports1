// Season-to-date rollups: Targets/Game and Catch %. Derived entirely from
// this player's own currentSeasonGames (already loaded for the recency
// blend) — no new data fetch.

import type { PlayerGameLog } from './types.js';

export interface SeasonRollups {
  targetsPerGame: number | null;
  catchPctSeason: number | null;
}

export function calculateSeasonRollups(currentSeasonGames: PlayerGameLog[]): SeasonRollups {
  if (currentSeasonGames.length === 0) {
    return { targetsPerGame: null, catchPctSeason: null };
  }

  const totalTargets = currentSeasonGames.reduce((sum, g) => sum + g.targets, 0);
  const totalReceptions = currentSeasonGames.reduce((sum, g) => sum + g.receptions, 0);

  return {
    targetsPerGame: totalTargets / currentSeasonGames.length,
    catchPctSeason: totalTargets > 0 ? totalReceptions / totalTargets : null,
  };
}

// STEP 2 — Projected team pass attempts.
//
// V1 blend of: the team's own recent/season pass-attempt volume, and the
// upcoming opponent's pass attempts allowed. Kept intentionally simple and
// modular — later inputs (Vegas spread, game total, game script, pace,
// weather, QB changes) plug in here without touching the rest of the model.

import type { TeamGameLog, FallbackReason } from './types.js';

// Local to this component since the spec doesn't name these in the global
// config — still named constants, still easy to tune/backtest.
const OWN_TEAM_WEIGHT = 0.6;
const OPPONENT_ALLOWED_WEIGHT = 0.4;
const RECENT_GAMES_WINDOW = 3;

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// Own team's pass-attempt volume estimate: recent games if enough exist,
// else whatever current-season games exist, else prior season — never a
// fabricated zero for a team with no games played yet this season.
function estimateOwnTeamVolume(
  currentTeamGames: TeamGameLog[],
  priorTeamGames: TeamGameLog[],
  fallbacksUsed: FallbackReason[]
): number | null {
  const n = currentTeamGames.length;
  if (n >= RECENT_GAMES_WINDOW) {
    return average(currentTeamGames.slice(-RECENT_GAMES_WINDOW).map((g) => g.passAttempts));
  }
  if (n >= 1) {
    return average(currentTeamGames.map((g) => g.passAttempts));
  }
  if (priorTeamGames.length > 0) {
    fallbacksUsed.push('EARLY_SEASON_PRIOR_SEASON_REGRESSION');
    return average(priorTeamGames.map((g) => g.passAttempts));
  }
  return null;
}

export interface ProjectedTeamPassAttemptsResult {
  projectedTeamPassAttempts: number | null;
  fallbacksUsed: FallbackReason[];
}

export function calculateProjectedTeamPassAttempts(
  currentTeamGames: TeamGameLog[],
  priorTeamGames: TeamGameLog[],
  opponentGamesAllowed: TeamGameLog[]
): ProjectedTeamPassAttemptsResult {
  const fallbacksUsed: FallbackReason[] = [];

  const ownVolume = estimateOwnTeamVolume(currentTeamGames, priorTeamGames, fallbacksUsed);
  const opponentAllowed = average(opponentGamesAllowed.map((g) => g.passAttempts));

  if (ownVolume !== null && opponentAllowed !== null) {
    return {
      projectedTeamPassAttempts: OWN_TEAM_WEIGHT * ownVolume + OPPONENT_ALLOWED_WEIGHT * opponentAllowed,
      fallbacksUsed,
    };
  }
  if (ownVolume !== null) return { projectedTeamPassAttempts: ownVolume, fallbacksUsed };
  if (opponentAllowed !== null) return { projectedTeamPassAttempts: opponentAllowed, fallbacksUsed };

  return { projectedTeamPassAttempts: null, fallbacksUsed };
}

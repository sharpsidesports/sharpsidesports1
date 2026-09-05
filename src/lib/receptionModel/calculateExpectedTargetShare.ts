// STEP 1 — Expected target share.
//
// Expected Target Share =
//   RECENT_3_WEIGHT  x last-3-games target share
// + RECENT_5_WEIGHT  x last-5-games target share
// + SEASON_WEIGHT    x season target share
//
// Weights come from src/lib/receptionModel/config.ts (MODEL_WEIGHTS) so they
// can be changed/backtested without touching this function. Early-season and
// team-change handling live in the shared recencyWeightedBlend engine.

import { recencyWeightedBlend, type RecencyBlendResult } from './recencyBlend.js';
import type { PlayerModelInput } from './types.js';

export function calculateExpectedTargetShare(player: PlayerModelInput): RecencyBlendResult {
  const currentSeasonValues = player.currentSeasonGames.map((g) => g.targetShare);
  const priorSeasonValues = player.priorSeasonGames.map((g) => g.targetShare);

  return recencyWeightedBlend(currentSeasonValues, priorSeasonValues, player.isTeamChangeThisSeason);
}

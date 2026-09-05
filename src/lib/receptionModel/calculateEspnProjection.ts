// The baseline prior, kept independently callable and untouched by the
// nflverse model: thin lookup over ESPN's own live weekly projected
// receptions (src/lib/espnProjections.ts -> getEspnWeekReceptionProjections),
// which callers can also use completely on its own with no dependency on
// anything in this directory.

import type { EspnPlayerReceptionProjection } from '../espnProjections.js';

export function calculateEspnProjection(
  espnId: string,
  espnProjectionsByEspnId: Map<string, EspnPlayerReceptionProjection>
): number | null {
  return espnProjectionsByEspnId.get(espnId)?.projectedReceptions ?? null;
}

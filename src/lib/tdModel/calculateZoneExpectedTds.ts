// Expected TDs, broken out by field zone (Goal Line/Red Zone/Fringe/Open
// Field) — the real, data-backed version of the zone table shown in the
// reference product's "Cheat Code" panel.
//
// This is a SEASON-TO-DATE CUMULATIVE view, not a forward projection: sum
// every rush/target this player has had in each zone so far this season,
// and price each zone's touches at the league-average TD rate for that
// zone. It answers "how many high-value touches has he gotten, and does the
// scoreboard reflect that" (the basis for TD Debt), not "how many will he
// get next game" — confirmed against a real example from the reference
// product, where its zone table's xTD column summed to its own displayed
// Expected TDs figure.

import { ZONES, RUSH_TD_RATE_BY_ZONE, TARGET_TD_RATE_BY_ZONE, type Zone } from './zoneConversionRates.js';

export interface PlayerZoneWeekLog {
  week: number;
  zone: Zone;
  carries: number;
  targets: number;
}

export interface ZoneBreakdownRow {
  zone: Zone;
  carries: number;
  targets: number;
  xTd: number;
}

export interface ZoneExpectedTdsResult {
  zoneBreakdown: ZoneBreakdownRow[];
  expectedTds: number;
}

// zoneLogs: this player's zone rows for the season so far (weeks < current
// week) — one row per week+zone they had >=1 touch in; a missing week+zone
// combo means 0 touches that week, and simply doesn't contribute (no need to
// zero-fill for a plain sum, unlike a per-game average).
export function calculateZoneExpectedTds(zoneLogs: PlayerZoneWeekLog[]): ZoneExpectedTdsResult {
  const zoneBreakdown: ZoneBreakdownRow[] = ZONES.map((zone) => {
    const rowsForZone = zoneLogs.filter((r) => r.zone === zone);
    const carries = rowsForZone.reduce((sum, r) => sum + r.carries, 0);
    const targets = rowsForZone.reduce((sum, r) => sum + r.targets, 0);
    const xTd = carries * RUSH_TD_RATE_BY_ZONE[zone] + targets * TARGET_TD_RATE_BY_ZONE[zone];
    return { zone, carries, targets, xTd };
  });

  const expectedTds = zoneBreakdown.reduce((sum, z) => sum + z.xTd, 0);

  return { zoneBreakdown, expectedTds };
}

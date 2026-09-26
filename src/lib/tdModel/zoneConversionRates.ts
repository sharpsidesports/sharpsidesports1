// League-average TD-per-touch rates by field zone, computed once offline
// from 3 full prior seasons of real nflverse play-by-play (2023-2025) via
// scripts/computeZoneConversionRates.ts — not live-computed, since a full
// season's PBP is ~19MB gzipped and re-fetching multiple seasons of it on
// every request/cron run would be far too slow and memory-heavy for what's
// otherwise a slowly-changing league constant.
//
// Re-run the script (with updated season args) and paste in fresh numbers
// every year or two, or if scoring environment shifts meaningfully.
//
// Zones: Goal Line (<=5 yards from the end zone), Red Zone (6-20), Fringe
// (21-40), Open Field (41+) — same buckets shown in the UI's zone table.

export type Zone = 'GOAL_LINE' | 'RED_ZONE' | 'FRINGE' | 'OPEN_FIELD';
export const ZONES: Zone[] = ['GOAL_LINE', 'RED_ZONE', 'FRINGE', 'OPEN_FIELD'];

// TD probability per rush attempt, by zone. Source: 2023-2025 PBP,
// qb_kneel/two_point_attempt plays excluded.
export const RUSH_TD_RATE_BY_ZONE: Record<Zone, number> = {
  GOAL_LINE: 0.41239, // 965 TDs / 2340 attempts
  RED_ZONE: 0.07078, // 396 / 5595
  FRINGE: 0.01173, // 104 / 8869
  OPEN_FIELD: 0.00366, // 102 / 27895
};

// TD probability per target (pass attempt with a recorded receiver,
// excluding sacks), by zone. Source: same 2023-2025 PBP sample.
export const TARGET_TD_RATE_BY_ZONE: Record<Zone, number> = {
  GOAL_LINE: 0.48505, // 714 / 1472
  RED_ZONE: 0.18752, // 1043 / 5562
  FRINGE: 0.04634, // 472 / 10186
  OPEN_FIELD: 0.00739, // 269 / 36391
};

export function zoneOf(yardline100: number): Zone {
  if (yardline100 <= 5) return 'GOAL_LINE';
  if (yardline100 <= 20) return 'RED_ZONE';
  if (yardline100 <= 40) return 'FRINGE';
  return 'OPEN_FIELD';
}

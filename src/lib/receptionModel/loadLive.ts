// server-only helper
// Assembles a BuildProjectionsInput straight from live ESPN + nflverse
// fetches, with no Supabase dependency. Used by the backfill/backtest
// scripts and for local verification runs — the production API route uses
// loadFromSupabase.ts instead, which reads the same shape from ingested
// tables so it doesn't re-fetch nflverse's full-season CSVs on every request.

import { getEspnWeekReceptionProjections } from '../espnProjections.js';
import { fetchStatsPlayerWeek } from '../nflverse/statsPlayerWeek.js';
import { fetchStatsTeamWeek } from '../nflverse/statsTeamWeek.js';
import { fetchInjuries } from '../nflverse/injuries.js';
import { fetchSchedules } from '../nflverse/schedules.js';
import { fetchPlayerCrosswalk } from '../nflverse/playerCrosswalk.js';
import type { BuildProjectionsInput } from './buildWeeklyReceptionProjections.js';

export async function loadLiveProjectionsInput(
  season: number,
  week: number,
  priorSeason: number = season - 1
): Promise<BuildProjectionsInput> {
  const [espn, crosswalkResult, teamWeekCurrent, teamWeekPrior, schedule] = await Promise.all([
    getEspnWeekReceptionProjections(season, week),
    fetchPlayerCrosswalk(),
    fetchStatsTeamWeek(season).catch(() => ({ rows: [], fetchedAt: null as string | null })),
    fetchStatsTeamWeek(priorSeason).catch(() => ({ rows: [], fetchedAt: null as string | null })),
    fetchSchedules(season).catch(() => ({ rows: [] as any[] })),
  ]);

  // Current season's stats_player_week file may not exist yet (start of
  // season, before nflverse has published it) — that's expected, not an
  // error; the model falls back to prior-season regression for everyone.
  const [playerWeekCurrent, playerWeekPrior] = await Promise.all([
    fetchStatsPlayerWeek(season).catch(() => ({ rows: [], fetchedAt: null as string | null })),
    fetchStatsPlayerWeek(priorSeason).catch(() => ({ rows: [], fetchedAt: null as string | null })),
  ]);

  const injuries = await fetchInjuries(season).catch(() => ({ rows: [] as any[] }));

  const playerWeekStats = [...playerWeekCurrent.rows, ...playerWeekPrior.rows];
  const teamWeekStats = [...teamWeekCurrent.rows, ...teamWeekPrior.rows];

  const latestAvailableNflverseWeek =
    playerWeekCurrent.rows.length > 0
      ? { season, week: Math.max(...playerWeekCurrent.rows.map((r) => r.week)) }
      : playerWeekPrior.rows.length > 0
        ? { season: priorSeason, week: Math.max(...playerWeekPrior.rows.map((r) => r.week)) }
        : null;

  return {
    season,
    week,
    priorSeason,
    espnProjections: espn.players,
    playerWeekStats,
    teamWeekStats,
    injuries: injuries.rows,
    schedule: schedule.rows,
    crosswalk: crosswalkResult.rows,
    nflverseFetchedAt: playerWeekCurrent.fetchedAt ?? playerWeekPrior.fetchedAt ?? null,
    latestAvailableNflverseWeek,
  };
}

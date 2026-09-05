// server-only helper
// Assembles a BuildPassingProjectionsInput straight from live ESPN +
// nflverse + Odds API fetches, with no Supabase dependency. Used by the
// backfill/backtest/demo scripts and local verification runs — the
// production API route uses loadFromSupabase.ts instead. Mirrors
// receptionModel/loadLive.ts.

import { getEspnWeekPassingProjections } from '../espnProjections.js';
import { fetchStatsQbWeek } from '../nflverse/statsQbWeek.js';
import { fetchStatsTeamWeek } from '../nflverse/statsTeamWeek.js';
import { fetchPlayerCrosswalk } from '../nflverse/playerCrosswalk.js';
import { fetchGameLines, pairKey } from '../oddsApi.js';
import { buildConsensusGameLines } from './buildConsensusGameLines.js';
import type { BuildPassingProjectionsInput } from './buildWeeklyPassingProjections.js';

export async function loadLivePassingProjectionsInput(
  season: number,
  week: number,
  priorSeason: number = season - 1
): Promise<BuildPassingProjectionsInput> {
  const [espn, crosswalkResult, teamWeekCurrent, teamWeekPrior] = await Promise.all([
    getEspnWeekPassingProjections(season, week),
    fetchPlayerCrosswalk(),
    fetchStatsTeamWeek(season).catch(() => ({ rows: [], fetchedAt: null as string | null })),
    fetchStatsTeamWeek(priorSeason).catch(() => ({ rows: [], fetchedAt: null as string | null })),
  ]);

  const [qbWeekCurrent, qbWeekPrior] = await Promise.all([
    fetchStatsQbWeek(season).catch(() => ({ rows: [], fetchedAt: null as string | null })),
    fetchStatsQbWeek(priorSeason).catch(() => ({ rows: [], fetchedAt: null as string | null })),
  ]);

  // fetchGameLines/pairKey operate in ESPN-abbreviation space (see
  // oddsApi.ts's TEAM_NAME_TO_ABBREV) — do not convert to nflverse codes
  // here; buildConsensusGameLines does that conversion on the output side.
  const validPairKeys = new Set<string>();
  for (const p of espn.players) {
    if (p.opponent && p.opponent !== 'BYE' && p.opponent !== 'TBD') {
      validPairKeys.add(pairKey(p.team, p.opponent));
    }
  }

  let gameLines: ReturnType<typeof buildConsensusGameLines> = [];
  try {
    const { outcomes } = await fetchGameLines(validPairKeys);
    gameLines = buildConsensusGameLines(outcomes, season, week);
  } catch {
    // Odds API unavailable/unconfigured — the model falls back cleanly with
    // a VEGAS_LINE_MISSING fallback reason per player.
  }

  const qbWeekStats = [...qbWeekCurrent.rows, ...qbWeekPrior.rows];
  const teamWeekStats = [...teamWeekCurrent.rows, ...teamWeekPrior.rows];

  const latestAvailableNflverseWeek =
    qbWeekCurrent.rows.length > 0
      ? { season, week: Math.max(...qbWeekCurrent.rows.map((r) => r.week)) }
      : qbWeekPrior.rows.length > 0
        ? { season: priorSeason, week: Math.max(...qbWeekPrior.rows.map((r) => r.week)) }
        : null;

  return {
    season,
    week,
    priorSeason,
    espnProjections: espn.players,
    qbWeekStats,
    teamWeekStats,
    gameLines,
    crosswalk: crosswalkResult.rows,
    nflverseFetchedAt: qbWeekCurrent.fetchedAt ?? qbWeekPrior.fetchedAt ?? null,
    latestAvailableNflverseWeek,
  };
}

// server-only helper
// Assembles a BuildPassingProjectionsInput from already-ingested Supabase
// tables (populated by api/nflverse/sync.ts and api/passing-model/sync-lines.ts)
// plus a live ESPN pull for the current week's baseline prior. Mirrors
// receptionModel/loadFromSupabase.ts, including its pagination fix — every
// read here MUST use fetchAllRows/.range(), since PostgREST caps a plain
// .select('*') at 1000 rows regardless of table size (this silently
// truncated the reception model's first production run).

import { receptionModelSupabaseAdmin as supabaseAdmin } from '../receptionModel/supabaseAdmin.js';
import { getEspnWeekPassingProjections } from '../espnProjections.js';
import type { NflverseQbWeekRow, NflverseTeamWeekRow, NflverseGameLineRow, PlayerCrosswalkRow } from '../nflverse/types.js';
import type { BuildPassingProjectionsInput } from './buildWeeklyPassingProjections.js';

const PAGE_SIZE = 1000;

async function fetchAllRows<T>(
  label: string,
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${label} read failed: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

export async function loadPassingSupabaseInput(
  season: number,
  week: number,
  priorSeason: number = season - 1
): Promise<BuildPassingProjectionsInput> {
  const [espn, crosswalkRows, qbWeekRows, teamWeekRows, gameLineRows] = await Promise.all([
    getEspnWeekPassingProjections(season, week),
    fetchAllRows<any>('player_crosswalk', (from, to) =>
      supabaseAdmin.from('player_crosswalk').select('*').range(from, to)
    ),
    fetchAllRows<any>('nflverse_qb_week_stats', (from, to) =>
      supabaseAdmin.from('nflverse_qb_week_stats').select('*').in('season', [season, priorSeason]).range(from, to)
    ),
    fetchAllRows<any>('nflverse_team_week_stats', (from, to) =>
      supabaseAdmin.from('nflverse_team_week_stats').select('*').in('season', [season, priorSeason]).range(from, to)
    ),
    fetchAllRows<any>('nflverse_game_lines', (from, to) =>
      supabaseAdmin.from('nflverse_game_lines').select('*').eq('season', season).eq('week', week).range(from, to)
    ),
  ]);

  const crosswalk: PlayerCrosswalkRow[] = crosswalkRows.map((r) => ({
    gsisId: r.gsis_id,
    espnId: r.espn_id,
    displayName: r.display_name,
    position: r.position ?? '',
    status: r.status,
    latestTeam: r.latest_team,
  }));

  const qbWeekStats: NflverseQbWeekRow[] = qbWeekRows.map((r) => ({
    gsisId: r.gsis_id,
    playerName: r.player_name,
    position: r.position,
    team: r.team,
    opponentTeam: r.opponent_team ?? '',
    season: r.season,
    week: r.week,
    seasonType: r.season_type,
    gameId: r.game_id ?? '',
    completions: r.completions,
    attempts: r.attempts,
    passingYards: r.passing_yards,
    passingTds: r.passing_tds,
    passingInterceptions: r.passing_interceptions,
    sacksSuffered: r.sacks_suffered,
    sackYardsLost: r.sack_yards_lost,
    passingAirYards: r.passing_air_yards,
    passingYardsAfterCatch: r.passing_yards_after_catch,
    passingFirstDowns: r.passing_first_downs,
    passingEpa: r.passing_epa,
    passingCpoe: r.passing_cpoe,
    pacr: r.pacr,
    carries: r.carries,
    rushingYards: r.rushing_yards,
    rushingTds: r.rushing_tds,
  }));

  const teamWeekStats: NflverseTeamWeekRow[] = teamWeekRows.map((r) => ({
    team: r.team,
    opponentTeam: r.opponent_team ?? '',
    season: r.season,
    week: r.week,
    seasonType: r.season_type,
    gameId: r.game_id ?? '',
    passAttempts: r.pass_attempts,
    completions: r.completions,
    passingYards: r.passing_yards,
    passingTds: r.passing_tds,
    passingInterceptions: r.passing_interceptions,
    sacksSuffered: r.sacks_suffered,
    passingAirYards: r.passing_air_yards,
    carries: r.carries,
    rushingYards: r.rushing_yards,
  }));

  const gameLines: NflverseGameLineRow[] = gameLineRows.map((r) => ({
    season: r.season,
    week: r.week,
    team: r.team,
    opponentTeam: r.opponent_team,
    isHome: r.is_home,
    spread: r.spread,
    total: r.total,
    impliedTeamTotal: r.implied_team_total,
    bookmaker: r.bookmaker,
  }));

  const currentSeasonWeeks = qbWeekStats.filter((r) => r.season === season).map((r) => r.week);
  const priorSeasonWeeks = qbWeekStats.filter((r) => r.season === priorSeason).map((r) => r.week);
  const latestAvailableNflverseWeek =
    currentSeasonWeeks.length > 0
      ? { season, week: Math.max(...currentSeasonWeeks) }
      : priorSeasonWeeks.length > 0
        ? { season: priorSeason, week: Math.max(...priorSeasonWeeks) }
        : null;

  const fetchedAtValues = qbWeekRows.map((r) => r.fetched_at).filter(Boolean);
  const nflverseFetchedAt = fetchedAtValues.length > 0 ? fetchedAtValues.sort().at(-1)! : null;

  return {
    season,
    week,
    priorSeason,
    espnProjections: espn.players,
    qbWeekStats,
    teamWeekStats,
    gameLines,
    crosswalk,
    nflverseFetchedAt,
    latestAvailableNflverseWeek,
  };
}

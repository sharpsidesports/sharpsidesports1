// server-only helper
// Assembles a BuildProjectionsInput from already-ingested Supabase tables
// (populated by api/nflverse/sync.ts) plus a live ESPN pull for the current
// week's baseline prior. This is the production path — it doesn't re-fetch
// nflverse's full-season CSVs on every request.

import { receptionModelSupabaseAdmin as supabaseAdmin } from './supabaseAdmin.js';
import { getEspnWeekReceptionProjections } from '../espnProjections.js';
import type { NflversePlayerWeekRow, NflverseTeamWeekRow, NflverseInjuryRow, PlayerCrosswalkRow } from '../nflverse/types.js';
import type { BuildProjectionsInput } from './buildWeeklyReceptionProjections.js';

// PostgREST caps a single select() response at 1000 rows regardless of
// table size — every one of these tables can exceed that (player_crosswalk
// alone is ~25k rows), so every read here must page through in full or rows
// get silently (and non-obviously) truncated.
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

export async function loadSupabaseProjectionsInput(
  season: number,
  week: number,
  priorSeason: number = season - 1
): Promise<BuildProjectionsInput> {
  const [espn, crosswalkRows, playerWeekRows, teamWeekRows, injuriesRows] = await Promise.all([
    getEspnWeekReceptionProjections(season, week),
    fetchAllRows('player_crosswalk', (from, to) =>
      supabaseAdmin.from('player_crosswalk').select('*').range(from, to)
    ),
    fetchAllRows('nflverse_player_week_stats', (from, to) =>
      supabaseAdmin.from('nflverse_player_week_stats').select('*').in('season', [season, priorSeason]).range(from, to)
    ),
    fetchAllRows('nflverse_team_week_stats', (from, to) =>
      supabaseAdmin.from('nflverse_team_week_stats').select('*').in('season', [season, priorSeason]).range(from, to)
    ),
    fetchAllRows('nflverse_injuries', (from, to) =>
      supabaseAdmin.from('nflverse_injuries').select('*').eq('season', season).eq('week', week).range(from, to)
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

  const playerWeekStats: NflversePlayerWeekRow[] = playerWeekRows.map((r) => ({
    gsisId: r.gsis_id,
    playerName: r.player_name,
    position: r.position,
    team: r.team,
    opponentTeam: r.opponent_team ?? '',
    season: r.season,
    week: r.week,
    seasonType: r.season_type,
    gameId: r.game_id ?? '',
    targets: r.targets,
    receptions: r.receptions,
    receivingYards: r.receiving_yards,
    receivingTds: r.receiving_tds,
    receivingAirYards: r.receiving_air_yards,
    targetShare: r.target_share,
    airYardsShare: r.air_yards_share,
    racr: r.racr,
  }));

  const teamWeekStats: NflverseTeamWeekRow[] = teamWeekRows.map((r) => ({
    team: r.team,
    opponentTeam: r.opponent_team ?? '',
    season: r.season,
    week: r.week,
    seasonType: r.season_type,
    gameId: r.game_id ?? '',
    passAttempts: r.pass_attempts,
    // Widened for the passing model (see src/lib/passingModel) — unused by
    // the reception model itself, kept here only to satisfy the shared type.
    completions: r.completions,
    passingYards: r.passing_yards,
    passingTds: r.passing_tds,
    passingInterceptions: r.passing_interceptions,
    sacksSuffered: r.sacks_suffered,
    passingAirYards: r.passing_air_yards,
    carries: r.carries,
    rushingYards: r.rushing_yards,
  }));

  const injuries: NflverseInjuryRow[] = injuriesRows.map((r) => ({
    gsisId: r.gsis_id,
    playerName: r.player_name,
    team: r.team,
    season: r.season,
    week: r.week,
    reportStatus: r.report_status,
    practiceStatus: r.practice_status,
  }));

  const currentSeasonWeeks = playerWeekStats.filter((r) => r.season === season).map((r) => r.week);
  const priorSeasonWeeks = playerWeekStats.filter((r) => r.season === priorSeason).map((r) => r.week);
  const latestAvailableNflverseWeek =
    currentSeasonWeeks.length > 0
      ? { season, week: Math.max(...currentSeasonWeeks) }
      : priorSeasonWeeks.length > 0
        ? { season: priorSeason, week: Math.max(...priorSeasonWeeks) }
        : null;

  const fetchedAtValues = playerWeekRows.map((r) => r.fetched_at).filter(Boolean);
  const nflverseFetchedAt = fetchedAtValues.length > 0 ? fetchedAtValues.sort().at(-1)! : null;

  return {
    season,
    week,
    priorSeason,
    espnProjections: espn.players,
    playerWeekStats,
    teamWeekStats,
    injuries,
    schedule: [], // not needed: bye/opponent come from ESPN's own opponent tag in the orchestrator
    crosswalk,
    nflverseFetchedAt,
    latestAvailableNflverseWeek,
  };
}

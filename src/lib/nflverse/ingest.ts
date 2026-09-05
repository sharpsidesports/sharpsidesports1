// server-only helper
// Pulls the current season's nflverse WR/team/injury/crosswalk data and
// upserts it into Supabase. Shared by the sync API route and the backfill
// script — both just call ingestSeason() for whichever season(s) they need.

import { receptionModelSupabaseAdmin as supabaseAdmin } from '../receptionModel/supabaseAdmin.js';
import { fetchStatsPlayerWeek } from './statsPlayerWeek.js';
import { fetchStatsQbWeek } from './statsQbWeek.js';
import { fetchStatsTeamWeek } from './statsTeamWeek.js';
import { fetchInjuries } from './injuries.js';
import { fetchPlayerCrosswalk } from './playerCrosswalk.js';

export interface IngestSeasonResult {
  season: number;
  playerWeekRows: number;
  qbWeekRows: number;
  teamWeekRows: number;
  injuryRows: number;
  errors: string[];
}

export async function ingestSeason(season: number): Promise<IngestSeasonResult> {
  const errors: string[] = [];
  let playerWeekRows = 0;
  let qbWeekRows = 0;
  let teamWeekRows = 0;
  let injuryRows = 0;

  try {
    const { rows, fetchedAt } = await fetchStatsPlayerWeek(season);
    const dbRows = rows.map((r) => ({
      gsis_id: r.gsisId,
      player_name: r.playerName,
      position: r.position,
      team: r.team,
      opponent_team: r.opponentTeam,
      season: r.season,
      week: r.week,
      season_type: r.seasonType,
      game_id: r.gameId,
      targets: r.targets,
      receptions: r.receptions,
      receiving_yards: r.receivingYards,
      receiving_tds: r.receivingTds,
      receiving_air_yards: r.receivingAirYards,
      target_share: r.targetShare,
      air_yards_share: r.airYardsShare,
      racr: r.racr,
      fetched_at: fetchedAt,
    }));
    if (dbRows.length > 0) {
      const { error } = await supabaseAdmin
        .from('nflverse_player_week_stats')
        .upsert(dbRows, { onConflict: 'gsis_id,season,week' });
      if (error) throw new Error(error.message);
      playerWeekRows = dbRows.length;
    }
  } catch (err) {
    errors.push(`stats_player_week: ${err instanceof Error ? err.message : String(err)}`);
  }

  try {
    const { rows, fetchedAt } = await fetchStatsQbWeek(season);
    const dbRows = rows.map((r) => ({
      gsis_id: r.gsisId,
      player_name: r.playerName,
      position: r.position,
      team: r.team,
      opponent_team: r.opponentTeam,
      season: r.season,
      week: r.week,
      season_type: r.seasonType,
      game_id: r.gameId,
      completions: r.completions,
      attempts: r.attempts,
      passing_yards: r.passingYards,
      passing_tds: r.passingTds,
      passing_interceptions: r.passingInterceptions,
      sacks_suffered: r.sacksSuffered,
      sack_yards_lost: r.sackYardsLost,
      passing_air_yards: r.passingAirYards,
      passing_yards_after_catch: r.passingYardsAfterCatch,
      passing_first_downs: r.passingFirstDowns,
      passing_epa: r.passingEpa,
      passing_cpoe: r.passingCpoe,
      pacr: r.pacr,
      carries: r.carries,
      rushing_yards: r.rushingYards,
      rushing_tds: r.rushingTds,
      fetched_at: fetchedAt,
    }));
    if (dbRows.length > 0) {
      const { error } = await supabaseAdmin
        .from('nflverse_qb_week_stats')
        .upsert(dbRows, { onConflict: 'gsis_id,season,week' });
      if (error) throw new Error(error.message);
      qbWeekRows = dbRows.length;
    }
  } catch (err) {
    errors.push(`stats_qb_week: ${err instanceof Error ? err.message : String(err)}`);
  }

  try {
    const { rows, fetchedAt } = await fetchStatsTeamWeek(season);
    const dbRows = rows.map((r) => ({
      team: r.team,
      opponent_team: r.opponentTeam,
      season: r.season,
      week: r.week,
      season_type: r.seasonType,
      game_id: r.gameId,
      pass_attempts: r.passAttempts,
      completions: r.completions,
      passing_yards: r.passingYards,
      passing_tds: r.passingTds,
      passing_interceptions: r.passingInterceptions,
      sacks_suffered: r.sacksSuffered,
      passing_air_yards: r.passingAirYards,
      carries: r.carries,
      rushing_yards: r.rushingYards,
      fetched_at: fetchedAt,
    }));
    if (dbRows.length > 0) {
      const { error } = await supabaseAdmin
        .from('nflverse_team_week_stats')
        .upsert(dbRows, { onConflict: 'team,season,week' });
      if (error) throw new Error(error.message);
      teamWeekRows = dbRows.length;
    }
  } catch (err) {
    errors.push(`stats_team_week: ${err instanceof Error ? err.message : String(err)}`);
  }

  try {
    const { rows, fetchedAt } = await fetchInjuries(season);
    const dbRows = rows
      .filter((r) => r.gsisId)
      .map((r) => ({
        gsis_id: r.gsisId as string,
        player_name: r.playerName,
        team: r.team,
        season: r.season,
        week: r.week,
        report_status: r.reportStatus,
        practice_status: r.practiceStatus,
        fetched_at: fetchedAt,
      }));
    if (dbRows.length > 0) {
      const { error } = await supabaseAdmin
        .from('nflverse_injuries')
        .upsert(dbRows, { onConflict: 'gsis_id,season,week' });
      if (error) throw new Error(error.message);
      injuryRows = dbRows.length;
    }
  } catch (err) {
    // Injury reports for a season that's fully in the past (e.g. backfill
    // years) may 404 once nflverse ages the file out — non-fatal, everything
    // else about the season is still usable.
    errors.push(`injuries: ${err instanceof Error ? err.message : String(err)}`);
  }

  return { season, playerWeekRows, qbWeekRows, teamWeekRows, injuryRows, errors };
}

export async function ingestPlayerCrosswalk(): Promise<{ rows: number }> {
  const { rows, fetchedAt } = await fetchPlayerCrosswalk();
  const dbRows = rows.map((r) => ({
    gsis_id: r.gsisId,
    espn_id: r.espnId,
    display_name: r.displayName,
    position: r.position,
    status: r.status,
    latest_team: r.latestTeam,
    fetched_at: fetchedAt,
  }));
  const { error } = await supabaseAdmin
    .from('player_crosswalk')
    .upsert(dbRows, { onConflict: 'gsis_id' });
  if (error) throw new Error(`player_crosswalk: ${error.message}`);
  return { rows: dbRows.length };
}

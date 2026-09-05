// server-only helper
// Writes computed passing projections to Supabase (passing_projections) so
// they're historically queryable. Mirrors receptionModel/persistReceptionProjections.ts.

import { receptionModelSupabaseAdmin as supabaseAdmin } from '../receptionModel/supabaseAdmin.js';
import type { PassingProjectionResult } from './types.js';

// Results with no matched nflverse ID can't be upserted against the
// (gsis_id, season, week) unique key — they're intentionally not persisted,
// but are still returned to API callers with 'UNMATCHED_PLAYER' surfaced.
export async function persistPassingProjections(
  results: PassingProjectionResult[]
): Promise<{ persisted: number; skipped: number }> {
  const rows = results
    .filter((r) => r.gsisId)
    .map((r) => ({
      gsis_id: r.gsisId as string,
      player_name: r.playerName,
      team: r.team,
      opponent_team: r.opponentTeam,
      season: r.dataSeason,
      week: r.dataWeek,
      espn_projected_attempts: r.espnProjectedAttempts,
      espn_projected_passing_yards: r.espnProjectedPassingYards,
      projected_team_pass_attempts: r.projectedTeamPassAttempts,
      expected_total_plays: r.expectedTotalPlays,
      expected_pass_rate: r.expectedPassRate,
      expected_attempts: r.expectedAttempts,
      attempts_over_expected: r.attemptsOverExpected,
      expected_yards_per_attempt: r.expectedYardsPerAttempt,
      expected_passing_yards: r.expectedPassingYards,
      projected_passing_yards: r.projectedPassingYards,
      yards_over_expected: r.yardsOverExpected,
      vegas_spread: r.vegasSpread,
      vegas_total: r.vegasTotal,
      vegas_implied_team_total: r.vegasTotal !== null && r.vegasSpread !== null
        ? r.vegasTotal / 2 - r.vegasSpread / 2
        : null,
      data_season: r.dataSeason,
      data_week: r.dataWeek,
      data_last_updated: r.dataLastUpdated,
      confidence: r.confidence,
      fallbacks_used: r.fallbacksUsed,
      warnings: r.warnings,
    }));

  if (rows.length === 0) return { persisted: 0, skipped: results.length };

  const { error } = await supabaseAdmin
    .from('passing_projections')
    .upsert(rows, { onConflict: 'gsis_id,season,week' });

  if (error) throw new Error(`Failed to persist passing projections: ${error.message}`);

  return { persisted: rows.length, skipped: results.length - rows.length };
}

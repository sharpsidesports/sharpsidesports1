// server-only helper
// Writes computed reception projections to Supabase (reception_projections)
// so they're historically queryable — this is also the backtest input.
// Kept separate from buildWeeklyReceptionProjections so the model logic
// itself stays a pure, DB-free function.

import { receptionModelSupabaseAdmin as supabaseAdmin } from './supabaseAdmin.js';
import type { ReceptionProjectionResult } from './types.js';

// Results with no matched nflverse ID can't be upserted against the
// (gsis_id, season, week) unique key — they're intentionally not persisted,
// but are still returned to API callers with 'UNMATCHED_PLAYER' surfaced.
export async function persistReceptionProjections(
  results: ReceptionProjectionResult[]
): Promise<{ persisted: number; skipped: number }> {
  const rows = results
    .filter((r) => r.gsisId)
    .map((r) => ({
      gsis_id: r.gsisId as string,
      player_name: r.playerName,
      team: r.team,
      season: r.dataSeason,
      week: r.dataWeek,
      espn_projected_receptions: r.espnProjectedReceptions,
      expected_target_share: r.expectedTargetShare,
      projected_team_pass_attempts: r.projectedTeamPassAttempts,
      projected_targets: r.projectedTargets,
      expected_catch_rate: r.expectedCatchRate,
      nflverse_projected_receptions: r.nflverseProjectedReceptions,
      final_projected_receptions_raw: r.finalProjectedReceptionsRaw,
      projected_receptions: r.projectedReceptions,
      reception_edge_score: r.receptionEdgeScore,
      projection_difference: r.projectionDifference,
      data_season: r.dataSeason,
      data_week: r.dataWeek,
      data_last_updated: r.dataLastUpdated,
      confidence: r.confidence,
      fallbacks_used: r.fallbacksUsed,
      warnings: r.warnings,
    }));

  if (rows.length === 0) return { persisted: 0, skipped: results.length };

  const { error } = await supabaseAdmin
    .from('reception_projections')
    .upsert(rows, { onConflict: 'gsis_id,season,week' });

  if (error) throw new Error(`Failed to persist reception projections: ${error.message}`);

  return { persisted: rows.length, skipped: results.length - rows.length };
}

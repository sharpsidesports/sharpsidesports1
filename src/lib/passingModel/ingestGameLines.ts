// server-only helper
// Fetches current-week spread/total from The Odds API and persists a
// consensus line per team to nflverse_game_lines.
//
// Deliberately NOT part of nflverse/ingest.ts's ingestSeason(): that
// function is a safe-to-replay historical backfill concept (idempotent
// re-fetch of a full-season CSV, fine to call for seasons in the deep
// past). Vegas lines are the opposite — only meaningful for the current /
// upcoming week, sourced from a live odds API with a request quota, and
// correctness depends on being called close to kickoff. This is called by
// its own cron (api/passing-model/sync-lines.ts), not the weekly nflverse sync.

import { receptionModelSupabaseAdmin as supabaseAdmin } from '../receptionModel/supabaseAdmin.js';
import { fetchGameLines, pairKey } from '../oddsApi.js';
import { buildConsensusGameLines } from './buildConsensusGameLines.js';

export async function ingestGameLines(
  season: number,
  week: number,
  validPairKeys: Set<string>
): Promise<{ rows: number }> {
  const { outcomes } = await fetchGameLines(validPairKeys);
  const rows = buildConsensusGameLines(outcomes, season, week);

  if (rows.length === 0) return { rows: 0 };

  const dbRows = rows.map((r) => ({
    season: r.season,
    week: r.week,
    team: r.team,
    opponent_team: r.opponentTeam,
    is_home: r.isHome,
    spread: r.spread,
    total: r.total,
    implied_team_total: r.impliedTeamTotal,
    bookmaker: r.bookmaker,
  }));

  const { error } = await supabaseAdmin
    .from('nflverse_game_lines')
    .upsert(dbRows, { onConflict: 'season,week,team,bookmaker' });
  if (error) throw new Error(`nflverse_game_lines: ${error.message}`);

  return { rows: dbRows.length };
}

// Re-exported so callers building validPairKeys don't need a separate
// import from oddsApi.js just for this.
export { pairKey };

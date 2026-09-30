import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ingestPbpZoneStats } from '../../src/lib/nflverse/ingest.js';

// Ingests the CURRENT season's play-by-play into per-player-per-week-per-
// zone touch counts (nflverse_player_zone_week_stats) — feeds the
// Anytime-TD model's zone table / Expected TDs / TD Debt.
//
// GET /api/nflverse/sync-pbp?season=2026
//
// Deliberately its own endpoint, separate from api/nflverse/sync.ts: tested
// standalone this took ~1s to fetch+parse and ~1.3s to upsert against the
// real database, but combined with sync.ts's other stats fetches in one
// invocation it pushed the request past its function's execution budget.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const season = Number(req.query.season) || new Date().getFullYear();

  try {
    const result = await ingestPbpZoneStats(season);
    if (result.error) {
      return res.status(500).json({ error: 'PBP zone sync failed', details: result.error });
    }
    return res.status(200).json({ season, ...result });
  } catch (error) {
    console.error('PBP zone sync failed:', error);
    return res.status(500).json({
      error: 'PBP zone sync failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ingestSeason, ingestPlayerCrosswalk } from '../../src/lib/nflverse/ingest.js';

// Pulls the current (and, on first run, prior) season's nflverse data into
// Supabase. GET /api/nflverse/sync?season=2026&priorSeason=2025
// Wired into vercel.json crons for a weekly in-season refresh; also safe to
// call manually/on-demand.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const season = Number(req.query.season) || new Date().getFullYear();
  const priorSeason = req.query.priorSeason ? Number(req.query.priorSeason) : season - 1;
  const includePrior = req.query.includePrior !== '0';

  try {
    const crosswalk = await ingestPlayerCrosswalk();
    const seasons = includePrior ? [season, priorSeason] : [season];
    const results = [];
    for (const s of seasons) {
      results.push(await ingestSeason(s));
    }
    return res.status(200).json({ crosswalk, seasons: results });
  } catch (error) {
    console.error('nflverse sync failed:', error);
    return res.status(500).json({
      error: 'nflverse sync failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

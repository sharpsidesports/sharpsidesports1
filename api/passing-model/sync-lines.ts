import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getEspnWeekPassingProjections } from '../../src/lib/espnProjections.js';
import { pairKey } from '../../src/lib/oddsApi.js';
import { ingestGameLines } from '../../src/lib/passingModel/ingestGameLines.js';

// GET /api/passing-model/sync-lines?season=2026&week=1
// Cron-only write endpoint (see vercel.json) — pulls current-week Vegas
// spread/total from The Odds API and persists a consensus line per team to
// nflverse_game_lines. Not called from the read path (api/passing-model.ts)
// so request-time cost never depends on Odds API quota. Only meaningful for
// the current/upcoming week — unlike nflverse ingestion, this is not a
// safe-to-replay historical backfill (see ingestGameLines.ts).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const season = Number(req.query.season) || new Date().getFullYear();
  const week = Number(req.query.week) || 1;

  try {
    // ESPN-abbreviation pair keys, matching oddsApi.ts's TEAM_NAME_TO_ABBREV
    // convention (fetchGameLines filters on these before any nflverse-code
    // conversion happens).
    const espn = await getEspnWeekPassingProjections(season, week);
    const validPairKeys = new Set<string>();
    for (const p of espn.players) {
      if (p.opponent && p.opponent !== 'BYE' && p.opponent !== 'TBD') {
        validPairKeys.add(pairKey(p.team, p.opponent));
      }
    }

    const result = await ingestGameLines(season, week, validPairKeys);
    return res.status(200).json({ season, week, ...result });
  } catch (error) {
    console.error('passing-model/sync-lines failed:', error);
    return res.status(500).json({
      error: 'Failed to sync game lines',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

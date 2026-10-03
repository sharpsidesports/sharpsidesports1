import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchPlayerCrosswalk } from '../../src/lib/nflverse/playerCrosswalk.js';
import { ingestSnapCounts, ingestNgsReceiving } from '../../src/lib/nflverse/ingest.js';

// Snap counts + NGS receiving — both small/fast fetches (unlike play-by-play,
// which needed its own endpoint in sync-pbp.ts after timing out combined with
// other work). GET /api/nflverse/sync-advanced?season=2026
// If this ever times out the same way the original combined sync.ts did,
// split it into two endpoints the same way sync-pbp.ts was split out.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const season = Number(req.query.season) || new Date().getFullYear();

  try {
    const { rows: crosswalk } = await fetchPlayerCrosswalk();
    const [snapCounts, ngsReceiving] = await Promise.all([
      ingestSnapCounts(season, crosswalk),
      ingestNgsReceiving(season),
    ]);
    return res.status(200).json({ season, snapCounts, ngsReceiving });
  } catch (error) {
    console.error('nflverse sync-advanced failed:', error);
    return res.status(500).json({
      error: 'nflverse sync-advanced failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildWeeklyReceptionProjections } from '../src/lib/receptionModel/buildWeeklyReceptionProjections.js';
import { loadSupabaseProjectionsInput } from '../src/lib/receptionModel/loadFromSupabase.js';
import { persistReceptionProjections } from '../src/lib/receptionModel/persistReceptionProjections.js';
import type { ReceptionProjectionResult } from '../src/lib/receptionModel/types.js';

// GET /api/reception-model?season=2026&week=1&refresh=1
// Same shape as api/nfl-projections.ts: in-memory TTL cache, force-refresh
// via ?refresh=1, falls back to a stale cache entry rather than a hard
// failure. Requires api/nflverse/sync.ts to have already ingested the
// relevant season(s) into Supabase.
const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { key: string; data: ReceptionProjectionResult[]; fetchedAt: number } | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const season = Number(req.query.season) || new Date().getFullYear();
  const week = Number(req.query.week) || 1;
  const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
  const cacheKey = `${season}-${week}`;

  try {
    if (!forceRefresh && cache && cache.key === cacheKey && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      return res.status(200).json({ season, week, players: cache.data, cached: true });
    }

    const input = await loadSupabaseProjectionsInput(season, week);
    const results = buildWeeklyReceptionProjections(input);
    cache = { key: cacheKey, data: results, fetchedAt: Date.now() };

    persistReceptionProjections(results).catch((err) =>
      console.error('reception-model: persist failed (non-fatal for this response):', err)
    );

    return res.status(200).json({ season, week, players: results, cached: false });
  } catch (error) {
    console.error('Error building reception model projections:', error);
    if (cache && cache.key === cacheKey) {
      return res.status(200).json({ season, week, players: cache.data, cached: true, stale: true });
    }
    return res.status(500).json({
      error: 'Failed to build reception model projections',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

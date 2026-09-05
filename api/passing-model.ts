import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildWeeklyPassingProjections } from '../src/lib/passingModel/buildWeeklyPassingProjections.js';
import { loadPassingSupabaseInput } from '../src/lib/passingModel/loadFromSupabase.js';
import { persistPassingProjections } from '../src/lib/passingModel/persistPassingProjections.js';
import type { PassingProjectionResult } from '../src/lib/passingModel/types.js';

// GET /api/passing-model?season=2026&week=1&refresh=1
// Same shape as api/reception-model.ts: in-memory TTL cache, force-refresh
// via ?refresh=1, falls back to a stale cache entry rather than a hard
// failure. Requires api/nflverse/sync.ts (QB/team stats) and
// api/passing-model/sync-lines.ts (Vegas lines) to have already ingested
// the relevant season/week into Supabase. Never calls the Odds API
// directly — read-only against whatever's already stored.
const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { key: string; data: PassingProjectionResult[]; fetchedAt: number } | null = null;

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

    const input = await loadPassingSupabaseInput(season, week);
    const results = buildWeeklyPassingProjections(input);
    cache = { key: cacheKey, data: results, fetchedAt: Date.now() };

    persistPassingProjections(results).catch((err) =>
      console.error('passing-model: persist failed (non-fatal for this response):', err)
    );

    return res.status(200).json({ season, week, players: results, cached: false });
  } catch (error) {
    console.error('Error building passing model projections:', error);
    if (cache && cache.key === cacheKey) {
      return res.status(200).json({ season, week, players: cache.data, cached: true, stale: true });
    }
    return res.status(500).json({
      error: 'Failed to build passing model projections',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

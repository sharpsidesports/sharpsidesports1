import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getEspnWeekAnytimeTdProjections, type EspnWeekProjectionsResult } from '../src/lib/espnProjections.js';

// Simple in-memory cache — persists across warm invocations of this function
// instance. Avoids hammering ESPN on every page load while keeping the data
// fresh; ?refresh=1 bypasses it for a manual update.
const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { key: string; data: EspnWeekProjectionsResult; fetchedAt: number } | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const season = Number(req.query.season) || 2026;
  const week = Number(req.query.week) || 1;
  const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
  const cacheKey = `${season}-${week}`;

  try {
    if (!forceRefresh && cache && cache.key === cacheKey && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      return res.status(200).json({ ...cache.data, cached: true });
    }

    const data = await getEspnWeekAnytimeTdProjections(season, week);
    cache = { key: cacheKey, data, fetchedAt: Date.now() };
    return res.status(200).json({ ...data, cached: false });
  } catch (error) {
    console.error('Error fetching ESPN projections:', error);
    // Fall back to a stale cache rather than a hard failure, if we have one
    if (cache && cache.key === cacheKey) {
      return res.status(200).json({ ...cache.data, cached: true, stale: true });
    }
    return res.status(500).json({
      error: 'Failed to fetch ESPN projections',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

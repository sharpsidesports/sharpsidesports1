import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getEspnWeekAnytimeTdProjections } from '../src/lib/espnProjections.js';
import { fetchAnytimeTdOdds, pairKey, type SportsbookOutcome } from '../src/lib/oddsApi.js';
import { normalizePlayerName } from '../src/lib/nameMatch.js';
import { americanOddsToImpliedProbability, probabilityToFairAmericanOdds } from '../src/lib/odds.js';

interface CombinedPlayer {
  player_id: string;
  player_name: string;
  team: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  opponent: string;
  projected_anytime_td: number;
  espn_td_probability: number;
  fanduel_odds: number | null;
  draftkings_odds: number | null;
  betmgm_odds: number | null;
  caesars_odds: number | null;
  sportsbook_count: number;
  consensus_td_probability: number | null;
  consensus_american_odds: number | null;
  edge: number | null;
}

interface CombinedResult {
  season: number;
  week: number;
  generatedAt: string;
  espnAvailable: boolean;
  oddsApiConfigured: boolean;
  oddsError: string | null;
  eventsChecked: number;
  eventsWithOdds: number;
  playerCount: number;
  matchedPlayerCount: number;
  unmatchedSportsbookPlayers: Array<{ name: string; bookmaker: string; price: number }>;
  players: CombinedPlayer[];
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

async function buildCombinedData(season: number, week: number): Promise<CombinedResult> {
  // Reuses the existing, unmodified ESPN projections pull.
  const espn = await getEspnWeekAnytimeTdProjections(season, week);

  // Only ask The Odds API about games that are actually happening this week
  // (per ESPN's own schedule), so we never cross-match a name against a
  // different week's slate.
  const validPairKeys = new Set<string>();
  for (const p of espn.players) {
    if (p.opponent && p.opponent !== 'BYE' && p.opponent !== 'TBD') {
      validPairKeys.add(pairKey(p.team, p.opponent));
    }
  }

  const apiKeyConfigured = !!process.env.ODDS_API_KEY;
  let oddsResult: { outcomes: SportsbookOutcome[]; eventsChecked: number; eventsWithOdds: number } | null = null;
  let oddsError: string | null = null;

  if (apiKeyConfigured) {
    try {
      oddsResult = await fetchAnytimeTdOdds(validPairKeys);
    } catch (err) {
      oddsError = err instanceof Error ? err.message : 'Unknown error fetching sportsbook odds';
    }
  } else {
    oddsError = 'ODDS_API_KEY is not set';
  }

  // Index ESPN players by normalized name for matching.
  const byName = new Map<string, typeof espn.players>();
  for (const p of espn.players) {
    const key = normalizePlayerName(p.player_name);
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key)!.push(p);
  }

  // player_id -> { bookmaker: price }
  const bookPrices = new Map<string, Partial<Record<'fanduel' | 'draftkings' | 'betmgm' | 'caesars', number>>>();
  const unmatched: Array<{ name: string; bookmaker: string; price: number }> = [];

  if (oddsResult) {
    for (const outcome of oddsResult.outcomes) {
      // Team check: only accept a name match if that ESPN player's team is
      // actually one of the two teams in this game. Prevents mismatching two
      // different players who happen to share a name.
      const candidates = (byName.get(outcome.normalizedName) ?? []).filter((p) =>
        outcome.eventTeams.includes(p.team)
      );
      if (candidates.length !== 1) {
        unmatched.push({ name: outcome.rawName, bookmaker: outcome.bookmaker, price: outcome.price });
        continue;
      }
      const player = candidates[0];
      if (!bookPrices.has(player.player_id)) bookPrices.set(player.player_id, {});
      bookPrices.get(player.player_id)![outcome.bookmaker] = outcome.price;
    }
  }

  const players: CombinedPlayer[] = espn.players.map((p) => {
    const prices = bookPrices.get(p.player_id) ?? {};
    const bookEntries = Object.entries(prices) as Array<[string, number]>;
    const probabilities = bookEntries.map(([, price]) => americanOddsToImpliedProbability(price));
    const consensusProbability =
      probabilities.length > 0 ? probabilities.reduce((sum, x) => sum + x, 0) / probabilities.length : null;

    return {
      player_id: p.player_id,
      player_name: p.player_name,
      team: p.team,
      position: p.position,
      opponent: p.opponent,
      projected_anytime_td: p.projected_anytime_td,
      espn_td_probability: p.td_probability,
      fanduel_odds: prices.fanduel ?? null,
      draftkings_odds: prices.draftkings ?? null,
      betmgm_odds: prices.betmgm ?? null,
      caesars_odds: prices.caesars ?? null,
      sportsbook_count: bookEntries.length,
      consensus_td_probability: consensusProbability !== null ? round4(consensusProbability) : null,
      consensus_american_odds:
        consensusProbability !== null ? probabilityToFairAmericanOdds(consensusProbability) : null,
      edge: consensusProbability !== null ? round4(p.td_probability - consensusProbability) : null,
    };
  });

  return {
    season: espn.season,
    week: espn.week,
    generatedAt: new Date().toISOString(),
    espnAvailable: espn.available,
    oddsApiConfigured: apiKeyConfigured,
    oddsError,
    eventsChecked: oddsResult?.eventsChecked ?? 0,
    eventsWithOdds: oddsResult?.eventsWithOdds ?? 0,
    playerCount: players.length,
    matchedPlayerCount: players.filter((p) => p.sportsbook_count > 0).length,
    unmatchedSportsbookPlayers: unmatched,
    players,
  };
}

// In-memory cache — persists across warm invocations of this function
// instance. Keeps us well under The Odds API's request quota; ?refresh=1
// bypasses it for a manual update.
const CACHE_TTL_MS = 30 * 60 * 1000;
let cache: { key: string; data: CombinedResult; fetchedAt: number } | null = null;

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

    const data = await buildCombinedData(season, week);
    cache = { key: cacheKey, data, fetchedAt: Date.now() };
    return res.status(200).json({ ...data, cached: false });
  } catch (error) {
    console.error('Error building ESPN + sportsbook odds data:', error);
    if (cache && cache.key === cacheKey) {
      return res.status(200).json({ ...cache.data, cached: true, stale: true });
    }
    return res.status(500).json({
      error: 'Failed to build ESPN + sportsbook odds data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

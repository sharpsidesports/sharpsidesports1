// server-only helper
// Pulls Anytime TD Scorer player-prop odds from The Odds API
// (https://the-odds-api.com/). Only imported by Node code (Vercel Serverless
// Functions) — ODDS_API_KEY must never reach the browser bundle.

import { normalizePlayerName } from './nameMatch.js';

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';
const SPORT_KEY = 'americanfootball_nfl';
const MARKET_KEY = 'player_anytime_td';

export const BOOKMAKERS = ['fanduel', 'draftkings', 'betmgm', 'caesars'] as const;
export type BookmakerKey = (typeof BOOKMAKERS)[number];

// Full franchise names as returned by The Odds API -> ESPN-style abbreviations
// (matches the abbreviations produced by src/lib/espnProjections.ts).
const TEAM_NAME_TO_ABBREV: Record<string, string> = {
  'Arizona Cardinals': 'ARI',
  'Atlanta Falcons': 'ATL',
  'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF',
  'Carolina Panthers': 'CAR',
  'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAX',
  'Kansas City Chiefs': 'KC',
  'Las Vegas Raiders': 'LV',
  'Los Angeles Chargers': 'LAC',
  'Los Angeles Rams': 'LAR',
  'Miami Dolphins': 'MIA',
  'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE',
  'New Orleans Saints': 'NO',
  'New York Giants': 'NYG',
  'New York Jets': 'NYJ',
  'Philadelphia Eagles': 'PHI',
  'Pittsburgh Steelers': 'PIT',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA',
  'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN',
  'Washington Commanders': 'WSH',
};

export function pairKey(teamA: string, teamB: string): string {
  return [teamA, teamB].sort().join('-');
}

export interface SportsbookOutcome {
  normalizedName: string;
  rawName: string;
  bookmaker: BookmakerKey;
  price: number;
  eventTeams: [string, string]; // abbrevs
}

export interface AnytimeTdOddsResult {
  outcomes: SportsbookOutcome[];
  eventsChecked: number;
  eventsWithOdds: number;
}

// Reusable pull: given the set of team-pair keys we actually care about
// (e.g. the real Week 1 matchups from ESPN's schedule), fetches Anytime TD
// Scorer odds for just those games. Safe to call on demand or from a cron.
export async function fetchAnytimeTdOdds(validPairKeys: Set<string>): Promise<AnytimeTdOddsResult> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    throw new Error('ODDS_API_KEY environment variable is not set');
  }

  const eventsRes = await fetch(`${ODDS_API_BASE}/sports/${SPORT_KEY}/events?apiKey=${apiKey}`);
  if (!eventsRes.ok) {
    throw new Error(`Odds API events request failed: ${eventsRes.status}`);
  }
  const events: any[] = await eventsRes.json();

  const relevantEvents = events.filter((e) => {
    const homeAbbrev = TEAM_NAME_TO_ABBREV[e.home_team];
    const awayAbbrev = TEAM_NAME_TO_ABBREV[e.away_team];
    if (!homeAbbrev || !awayAbbrev) return false;
    return validPairKeys.has(pairKey(homeAbbrev, awayAbbrev));
  });

  const outcomes: SportsbookOutcome[] = [];
  let eventsWithOdds = 0;

  for (const event of relevantEvents) {
    const homeAbbrev = TEAM_NAME_TO_ABBREV[event.home_team];
    const awayAbbrev = TEAM_NAME_TO_ABBREV[event.away_team];

    const url =
      `${ODDS_API_BASE}/sports/${SPORT_KEY}/events/${event.id}/odds` +
      `?apiKey=${apiKey}&regions=us&markets=${MARKET_KEY}&oddsFormat=american&bookmakers=${BOOKMAKERS.join(',')}`;

    const res = await fetch(url);
    if (!res.ok) {
      // One bad/unavailable event shouldn't kill the whole refresh.
      continue;
    }
    const data = await res.json();
    const bookmakers: any[] = data?.bookmakers ?? [];
    if (bookmakers.length > 0) eventsWithOdds++;

    for (const bm of bookmakers) {
      if (!(BOOKMAKERS as readonly string[]).includes(bm.key)) continue;
      const market = (bm.markets ?? []).find((m: any) => m.key === MARKET_KEY);
      if (!market) continue;

      for (const outcome of market.outcomes ?? []) {
        // player_anytime_td is a Yes/No market — we only want the "Yes" price.
        if (String(outcome.name).toLowerCase() !== 'yes') continue;
        const rawName: string | undefined = outcome.description;
        if (!rawName || typeof outcome.price !== 'number') continue;

        outcomes.push({
          normalizedName: normalizePlayerName(rawName),
          rawName,
          bookmaker: bm.key as BookmakerKey,
          price: outcome.price,
          eventTeams: [homeAbbrev, awayAbbrev],
        });
      }
    }
  }

  return { outcomes, eventsChecked: relevantEvents.length, eventsWithOdds };
}

// Reusable pull for the QB passing model's Vegas-line inputs: game spread
// and total, per team. Same control flow as fetchAnytimeTdOdds above, just
// a different market pair (spreads/totals are standard sibling markets on
// The Odds API, not a new provider).
export interface GameLineOutcome {
  homeAbbrev: string;
  awayAbbrev: string;
  homeSpread: number | null;
  awaySpread: number | null;
  total: number | null;
  bookmaker: BookmakerKey;
}

export interface GameLinesResult {
  outcomes: GameLineOutcome[];
  eventsChecked: number;
  eventsWithOdds: number;
}

export async function fetchGameLines(validPairKeys: Set<string>): Promise<GameLinesResult> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    throw new Error('ODDS_API_KEY environment variable is not set');
  }

  const eventsRes = await fetch(`${ODDS_API_BASE}/sports/${SPORT_KEY}/events?apiKey=${apiKey}`);
  if (!eventsRes.ok) {
    throw new Error(`Odds API events request failed: ${eventsRes.status}`);
  }
  const events: any[] = await eventsRes.json();

  const relevantEvents = events.filter((e) => {
    const homeAbbrev = TEAM_NAME_TO_ABBREV[e.home_team];
    const awayAbbrev = TEAM_NAME_TO_ABBREV[e.away_team];
    if (!homeAbbrev || !awayAbbrev) return false;
    return validPairKeys.has(pairKey(homeAbbrev, awayAbbrev));
  });

  const outcomes: GameLineOutcome[] = [];
  let eventsWithOdds = 0;

  for (const event of relevantEvents) {
    const homeAbbrev = TEAM_NAME_TO_ABBREV[event.home_team];
    const awayAbbrev = TEAM_NAME_TO_ABBREV[event.away_team];

    const url =
      `${ODDS_API_BASE}/sports/${SPORT_KEY}/events/${event.id}/odds` +
      `?apiKey=${apiKey}&regions=us&markets=spreads,totals&oddsFormat=american&bookmakers=${BOOKMAKERS.join(',')}`;

    const res = await fetch(url);
    if (!res.ok) {
      // One bad/unavailable event shouldn't kill the whole refresh.
      continue;
    }
    const data = await res.json();
    const bookmakers: any[] = data?.bookmakers ?? [];
    if (bookmakers.length > 0) eventsWithOdds++;

    for (const bm of bookmakers) {
      if (!(BOOKMAKERS as readonly string[]).includes(bm.key)) continue;

      const spreadsMarket = (bm.markets ?? []).find((m: any) => m.key === 'spreads');
      const totalsMarket = (bm.markets ?? []).find((m: any) => m.key === 'totals');

      const homeSpreadOutcome = spreadsMarket?.outcomes?.find((o: any) => o.name === event.home_team);
      const awaySpreadOutcome = spreadsMarket?.outcomes?.find((o: any) => o.name === event.away_team);
      const totalOutcome = totalsMarket?.outcomes?.[0];

      if (!homeSpreadOutcome && !awaySpreadOutcome && !totalOutcome) continue;

      outcomes.push({
        homeAbbrev,
        awayAbbrev,
        homeSpread: typeof homeSpreadOutcome?.point === 'number' ? homeSpreadOutcome.point : null,
        awaySpread: typeof awaySpreadOutcome?.point === 'number' ? awaySpreadOutcome.point : null,
        total: typeof totalOutcome?.point === 'number' ? totalOutcome.point : null,
        bookmaker: bm.key as BookmakerKey,
      });
    }
  }

  return { outcomes, eventsChecked: relevantEvents.length, eventsWithOdds };
}

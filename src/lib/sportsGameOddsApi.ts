// server-only helper
// TEMPORARY STAND-IN — The Odds API key is out of quota for this billing
// cycle (see oddsApi.ts's OddsApiQuotaExhaustedError, hit 2026-09-12, one
// day before Week 1 kickoff). This provides the exact same SportsbookOutcome/
// GameLinesResult shapes as The Odds API's fetchAnytimeTdOdds/fetchGameLines,
// from SportsGameOdds' free "Amateur" tier (sportsgameodds.com), so the two
// callers (api/nfl-odds.ts, src/lib/passingModel/ingestGameLines.ts) need
// zero changes downstream.
//
// REVERT PLAN (do this once The Odds API quota resets or the plan is
// upgraded): in api/nfl-odds.ts, change the import back to
// `fetchAnytimeTdOdds` from './oddsApi.js'; in ingestGameLines.ts, change it
// back to `fetchGameLines` from '../oddsApi.js'; then delete this file.

import { normalizePlayerName } from './nameMatch.js';
import {
  BOOKMAKERS,
  pairKey,
  type BookmakerKey,
  type SportsbookOutcome,
  type AnytimeTdOddsResult,
  type GameLineOutcome,
  type GameLinesResult,
} from './oddsApi.js';

const SPORTSGAMEODDS_BASE = 'https://api.sportsgameodds.com/v2';

// SportsGameOdds uses nflverse-style codes (LA, WAS) — the opposite mismatch
// from The Odds API's ESPN-style codes (LAR, WSH). api/nfl-odds.ts's
// matching logic operates entirely in ESPN-abbreviation space, so convert
// here rather than touching that shared logic.
const SGO_TO_ESPN: Record<string, string> = {
  LA: 'LAR',
  WAS: 'WSH',
};
function toEspnTeamCode(sgoAbbrev: string): string {
  return SGO_TO_ESPN[sgoAbbrev] ?? sgoAbbrev;
}

// Shared by every SportsGameOdds puller (Anytime-TD props, game lines, ...):
// fetches this week's NFL events (paginating through the free tier's ~10/page
// limit) and filters down to just the games we actually care about.
async function fetchRelevantSportsGameOddsEvents(validPairKeys: Set<string>): Promise<any[]> {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY;
  if (!apiKey) {
    throw new Error('SPORTSGAMEODDS_API_KEY environment variable is not set');
  }

  const now = new Date();
  // Wide enough to catch a Thursday-night game already underway and a
  // following Monday-nighter, without pulling next week's slate. Not
  // filtering by oddsAvailable=true here — that flag was observed false on
  // a real game (LAR@SF) that still had 1400+ populated odds keys, so it's
  // stricter than what's actually usable. Per-market/per-bookmaker
  // `available` checks below do the real filtering instead.
  const startsAfter = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const startsBefore = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const events: any[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    // The free tier paginates ~10 events/page — a full NFL week (16 games)
    // needs at least 2 pages. Following nextCursor until it's absent is the
    // difference between finding 10 of 16 real games and finding all of them.
    const url =
      `${SPORTSGAMEODDS_BASE}/events/?leagueID=NFL&startsAfter=${startsAfter}&startsBefore=${startsBefore}` +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');
    const res = await fetch(url, { headers: { 'X-Api-Key': apiKey } });
    if (!res.ok) {
      throw new Error(`SportsGameOdds events request failed: ${res.status}`);
    }
    const json = await res.json();
    events.push(...(json?.data ?? []));
    cursor = json?.nextCursor;
    if (!cursor) break;
  }

  return events.filter((e) => {
    const homeAbbrev = toEspnTeamCode(e.teams?.home?.names?.short);
    const awayAbbrev = toEspnTeamCode(e.teams?.away?.names?.short);
    if (!homeAbbrev || !awayAbbrev) return false;
    return validPairKeys.has(pairKey(homeAbbrev, awayAbbrev));
  });
}

export async function fetchAnytimeTdOddsFromSportsGameOdds(validPairKeys: Set<string>): Promise<AnytimeTdOddsResult> {
  const relevantEvents = await fetchRelevantSportsGameOddsEvents(validPairKeys);

  const outcomes: SportsbookOutcome[] = [];
  let eventsWithOdds = 0;

  for (const event of relevantEvents) {
    const homeAbbrev = toEspnTeamCode(event.teams.home.names.short);
    const awayAbbrev = toEspnTeamCode(event.teams.away.names.short);

    const odds = event.odds ?? {};
    const players = event.players ?? {};
    // The anytime-TD "yes" market has statID "touchdowns" and oddID shape
    // `touchdowns-{playerID}-game-yn-yes` — distinct from
    // passing_touchdowns/rushing_touchdowns/receiving_touchdowns over-under
    // markets, which have different statID prefixes and don't match
    // startsWith('touchdowns-').
    const anytimeTdKeys = Object.keys(odds).filter((k) => k.startsWith('touchdowns-') && k.endsWith('-game-yn-yes'));

    let eventHadOdds = false;

    for (const key of anytimeTdKeys) {
      const market = odds[key];
      const byBookmaker = market?.byBookmaker ?? {};
      const player = players[market?.playerID];
      const rawName: string | undefined = player?.name;
      if (!rawName) continue;

      for (const bookmaker of BOOKMAKERS) {
        const bm = byBookmaker[bookmaker];
        if (!bm?.available || typeof bm.odds !== 'string') continue;
        const price = Number(bm.odds);
        if (!Number.isFinite(price)) continue;

        eventHadOdds = true;
        outcomes.push({
          normalizedName: normalizePlayerName(rawName),
          rawName,
          bookmaker: bookmaker as BookmakerKey,
          price,
          eventTeams: [homeAbbrev, awayAbbrev],
        });
      }
    }

    if (eventHadOdds) eventsWithOdds++;
  }

  return { outcomes, eventsChecked: relevantEvents.length, eventsWithOdds };
}

// Game spread/total — SportsGameOdds' equivalent of The Odds API's
// spreads/totals markets. oddIDs: 'points-home-game-sp-home' /
// 'points-away-game-sp-away' (each side's own spread lives on its own oddID,
// unlike The Odds API where both outcomes sit in one 'spreads' market) and
// 'points-all-game-ou-over' (game total; 'over' and 'under' share the same
// number, so only one side needs reading). Confirmed against a live
// SportsGameOdds response (2026-09-25) rather than guessed.
export async function fetchGameLinesFromSportsGameOdds(validPairKeys: Set<string>): Promise<GameLinesResult> {
  const relevantEvents = await fetchRelevantSportsGameOddsEvents(validPairKeys);

  const outcomes: GameLineOutcome[] = [];
  let eventsWithOdds = 0;

  for (const event of relevantEvents) {
    const homeAbbrev = toEspnTeamCode(event.teams.home.names.short);
    const awayAbbrev = toEspnTeamCode(event.teams.away.names.short);

    const odds = event.odds ?? {};
    const homeSpreadByBookmaker = odds['points-home-game-sp-home']?.byBookmaker ?? {};
    const awaySpreadByBookmaker = odds['points-away-game-sp-away']?.byBookmaker ?? {};
    const totalByBookmaker = odds['points-all-game-ou-over']?.byBookmaker ?? {};

    let eventHadOdds = false;

    for (const bookmaker of BOOKMAKERS) {
      const homeBm = homeSpreadByBookmaker[bookmaker];
      const awayBm = awaySpreadByBookmaker[bookmaker];
      const totalBm = totalByBookmaker[bookmaker];

      const parseFinite = (value: unknown): number | null => {
        if (typeof value !== 'string') return null;
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
      };

      const homeSpread = homeBm?.available ? parseFinite(homeBm.spread) : null;
      const awaySpread = awayBm?.available ? parseFinite(awayBm.spread) : null;
      const total = totalBm?.available ? parseFinite(totalBm.overUnder) : null;

      if (homeSpread === null && awaySpread === null && total === null) continue;

      eventHadOdds = true;
      outcomes.push({
        homeAbbrev,
        awayAbbrev,
        homeSpread,
        awaySpread,
        total,
        bookmaker,
      });
    }

    if (eventHadOdds) eventsWithOdds++;
  }

  return { outcomes, eventsChecked: relevantEvents.length, eventsWithOdds };
}

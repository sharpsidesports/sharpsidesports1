import type { VercelRequest, VercelResponse } from '@vercel/node';
import { receptionModelSupabaseAdmin as supabaseAdmin } from '../src/lib/receptionModel/supabaseAdmin.js';

// GET /api/nfl-pace?season=2026
// Plays/game ranking (pace) for every team — offense (how often this team's
// own offense runs a play) and defense (how many plays this team's defense
// has faced), both derived from nflverse_team_week_stats, already ingested
// by api/nflverse/sync.ts. No new data source.
//
// Plays = pass attempts + carries + sacks suffered — a standard pace proxy,
// not a literal play-by-play count (that would require streaming the full
// play-by-play file, same cost tradeoff noted in src/lib/nflverse/pbp.ts).

const PAGE_SIZE = 1000;

interface TeamWeekRow {
  team: string;
  opponent_team: string | null;
  week: number;
  pass_attempts: number;
  carries: number;
  sacks_suffered: number;
}

interface TeamPaceRow {
  team: string;
  gamesPlayed: number;
  offensePlaysPerGame: number;
}

async function fetchAllRows(season: number): Promise<TeamWeekRow[]> {
  const rows: TeamWeekRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabaseAdmin
      .from('nflverse_team_week_stats')
      .select('team, opponent_team, week, pass_attempts, carries, sacks_suffered')
      .eq('season', season)
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`nflverse_team_week_stats read failed: ${error.message}`);
    rows.push(...((data as TeamWeekRow[] | null) ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

function aggregate(rows: TeamWeekRow[], keyOf: (r: TeamWeekRow) => string | null): TeamPaceRow[] {
  const byTeam = new Map<string, { plays: number; games: number }>();
  for (const r of rows) {
    const key = keyOf(r);
    if (!key) continue;
    const plays = r.pass_attempts + r.carries + r.sacks_suffered;
    const existing = byTeam.get(key) ?? { plays: 0, games: 0 };
    existing.plays += plays;
    existing.games += 1;
    byTeam.set(key, existing);
  }
  return Array.from(byTeam.entries()).map(([team, { plays, games }]) => ({
    team,
    gamesPlayed: games,
    offensePlaysPerGame: games > 0 ? Math.round((plays / games) * 10) / 10 : 0,
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const season = Number(req.query.season) || new Date().getFullYear();

  try {
    const rows = await fetchAllRows(season);
    const offense = aggregate(rows, (r) => r.team);
    const defenseFaced = aggregate(rows, (r) => r.opponent_team);
    const defenseByTeam = new Map(defenseFaced.map((d) => [d.team, d]));

    const teams = offense
      .map((o) => ({
        team: o.team,
        gamesPlayed: o.gamesPlayed,
        offensePlaysPerGame: o.offensePlaysPerGame,
        defensePlaysPerGame: defenseByTeam.get(o.team)?.offensePlaysPerGame ?? null,
      }))
      .sort((a, b) => b.offensePlaysPerGame - a.offensePlaysPerGame);

    return res.status(200).json({ season, generatedAt: new Date().toISOString(), teams });
  } catch (error) {
    console.error('Error building pace rankings:', error);
    return res.status(500).json({
      error: 'Failed to build pace rankings',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

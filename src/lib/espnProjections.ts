// server-only helper
// Pulls player projections directly from ESPN Fantasy Football's own JSON API
// (the same endpoint fantasy.espn.com/football/players/projections uses under
// the hood) — no HTML scraping, no CSV/spreadsheet involved.
// Only imported by Node code (Vercel Serverless Functions).

const ESPN_BASE = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl';

const POSITION_MAP: Record<number, 'QB' | 'RB' | 'WR' | 'TE'> = {
  1: 'QB',
  2: 'RB',
  3: 'WR',
  4: 'TE',
};

// ESPN roster slot ids for the base QB / RB / WR / TE positions (excludes
// FLEX, bench, D/ST, K, etc).
const SKILL_SLOT_IDS = [0, 2, 4, 6];

// ESPN fantasy stat ids (confirmed by inspecting live API responses):
//   4  = passing touchdowns
//   25 = rushing touchdowns
//   43 = receiving touchdowns
const STAT_ID_PASS_TD = '4';
const STAT_ID_RUSH_TD = '25';
const STAT_ID_REC_TD = '43';

export interface EspnPlayerProjection {
  player_id: string;
  player_name: string;
  team: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  opponent: string;
  projected_pass_td: number;
  projected_rush_td: number;
  projected_rec_td: number;
  projected_anytime_td: number;
  td_probability: number;
  fair_american_odds: number | null;
}

export interface EspnWeekProjectionsResult {
  season: number;
  week: number;
  generatedAt: string;
  available: boolean;
  playerCount: number;
  players: EspnPlayerProjection[];
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

// Converts a win probability into fair (no-vig) American odds.
function fairAmericanOdds(probability: number): number | null {
  if (!(probability > 0) || probability >= 1) return null;
  if (probability >= 0.5) {
    return Math.round(-100 * (probability / (1 - probability)));
  }
  return Math.round(100 * ((1 - probability) / probability));
}

// ESPN's stat-block ids encode source + split type + season + period, e.g.
// weekly projected stats for week 1 of the 2026 season = "1" (projected)
// + "1" (weekly split) + "2026" + "1" = "1120261". Season-total projected
// stats omit the period digit entirely, e.g. "10" + "2026" = "102026".
function weeklyProjectedStatId(season: number, week: number): string {
  return `11${season}${week}`;
}
function seasonProjectedStatId(season: number): string {
  return `10${season}`;
}

async function fetchProTeamOpponents(
  season: number,
  week: number
): Promise<Map<number, { abbrev: string; opponent: string }>> {
  const res = await fetch(`${ESPN_BASE}/seasons/${season}?view=proTeamSchedules`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`ESPN schedule request failed: ${res.status}`);
  }
  const data = await res.json();
  const teams: any[] = data?.settings?.proTeams ?? [];

  const idToAbbrev = new Map<number, string>();
  for (const t of teams) {
    if (t.id) idToAbbrev.set(t.id, t.abbrev);
  }

  const result = new Map<number, { abbrev: string; opponent: string }>();
  for (const t of teams) {
    if (!t.id) continue;
    const games = t.proGamesByScoringPeriod?.[String(week)] ?? [];
    let opponent = 'BYE';
    if (games.length > 0) {
      const g = games[0];
      const opponentId = g.homeProTeamId === t.id ? g.awayProTeamId : g.homeProTeamId;
      opponent = idToAbbrev.get(opponentId) ?? 'TBD';
    }
    result.set(t.id, { abbrev: t.abbrev, opponent });
  }
  return result;
}

async function fetchProjectedPlayers(season: number, week: number): Promise<any[]> {
  const weekStatId = weeklyProjectedStatId(season, week);
  const seasonStatId = seasonProjectedStatId(season);

  const filter = {
    players: {
      filterSlotIds: { value: SKILL_SLOT_IDS },
      filterStatsForTopScoringPeriodIds: {
        value: 500,
        additionalValue: [`00${season}`, seasonStatId, weekStatId],
      },
      limit: 500,
      sortAppliedStatTotal: { sortAsc: false, sortPriority: 2, value: seasonStatId },
      sortDraftRanks: { sortPriority: 1, sortAsc: true, value: 'STANDARD' },
    },
  };

  const res = await fetch(
    `${ESPN_BASE}/seasons/${season}/segments/0/leaguedefaults/3?scoringPeriodId=${week}&view=kona_player_info`,
    {
      headers: {
        Accept: 'application/json',
        'x-fantasy-filter': JSON.stringify(filter),
      },
    }
  );
  if (!res.ok) {
    throw new Error(`ESPN players request failed: ${res.status}`);
  }
  const data = await res.json();
  return data?.players ?? [];
}

// Reusable pull: fetches ESPN's real per-week projections (not season/17) for
// every relevant QB/RB/WR/TE and computes anytime-TD odds. Safe to call from
// an API route on demand or from a scheduled job later — it does no writes,
// just returns the current data.
export async function getEspnWeekAnytimeTdProjections(
  season: number,
  week: number
): Promise<EspnWeekProjectionsResult> {
  const weekStatId = weeklyProjectedStatId(season, week);

  const [teamMap, rawPlayers] = await Promise.all([
    fetchProTeamOpponents(season, week),
    fetchProjectedPlayers(season, week),
  ]);

  const players: EspnPlayerProjection[] = [];

  for (const entry of rawPlayers) {
    const p = entry?.player;
    if (!p) continue;
    const position = POSITION_MAP[p.defaultPositionId];
    if (!position) continue;

    const weekStat = (p.stats ?? []).find((s: any) => s.id === weekStatId);
    if (!weekStat) continue; // ESPN has not projected this player for this week yet

    const stats = weekStat.stats ?? {};
    const passTd = Number(stats[STAT_ID_PASS_TD] ?? 0);
    const rushTd = Number(stats[STAT_ID_RUSH_TD] ?? 0);
    const recTd = Number(stats[STAT_ID_REC_TD] ?? 0);
    const anytimeTd = rushTd + recTd;
    const probability = 1 - Math.exp(-anytimeTd);

    const teamInfo = teamMap.get(p.proTeamId);

    players.push({
      player_id: String(p.id),
      player_name: p.fullName,
      team: teamInfo?.abbrev ?? 'FA',
      position,
      opponent: teamInfo?.opponent ?? 'TBD',
      projected_pass_td: round3(passTd),
      projected_rush_td: round3(rushTd),
      projected_rec_td: round3(recTd),
      projected_anytime_td: round3(anytimeTd),
      td_probability: round3(probability),
      fair_american_odds: fairAmericanOdds(probability),
    });
  }

  players.sort((a, b) => b.projected_anytime_td - a.projected_anytime_td);

  return {
    season,
    week,
    generatedAt: new Date().toISOString(),
    available: players.length > 0,
    playerCount: players.length,
    players,
  };
}

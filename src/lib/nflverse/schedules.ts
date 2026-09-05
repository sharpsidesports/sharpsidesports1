// server-only helper
// Full NFL schedule from nflverse's `schedules` release (single combined
// file across all seasons — used for opponent lookups and bye-week detection).
// File: games.csv

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { NflverseScheduleRow } from './types.js';

interface RawRow {
  game_id: string;
  season: string;
  game_type: string;
  week: string;
  away_team: string;
  home_team: string;
}

export async function fetchSchedules(
  season?: number
): Promise<NflverseCsvResult<NflverseScheduleRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>('schedules', 'games.csv');

  const mapped = rows
    .filter((r) => r.game_type === 'REG' && (season === undefined || Number(r.season) === season))
    .map((r): NflverseScheduleRow => ({
      season: Number(r.season),
      week: Number(r.week),
      gameId: r.game_id,
      homeTeam: r.home_team,
      awayTeam: r.away_team,
      seasonType: r.game_type,
    }));

  return { rows: mapped, fetchedAt, sourceUrl };
}

// A team is on bye for (season, week) if it appears in neither the home nor
// away slot of any game that week, despite the league having games that week.
export function teamsOnBye(schedule: NflverseScheduleRow[], season: number, week: number): Set<string> {
  const weekGames = schedule.filter((g) => g.season === season && g.week === week);
  if (weekGames.length === 0) return new Set(); // no data for this week — don't claim byes we can't see

  const allTeams = new Set<string>();
  const playingTeams = new Set<string>();
  for (const g of schedule.filter((game) => game.season === season)) {
    allTeams.add(g.homeTeam);
    allTeams.add(g.awayTeam);
  }
  for (const g of weekGames) {
    playingTeams.add(g.homeTeam);
    playingTeams.add(g.awayTeam);
  }
  const bye = new Set<string>();
  for (const team of allTeams) {
    if (!playingTeams.has(team)) bye.add(team);
  }
  return bye;
}

export function findOpponent(
  schedule: NflverseScheduleRow[],
  team: string,
  season: number,
  week: number
): string | null {
  const game = schedule.find(
    (g) => g.season === season && g.week === week && (g.homeTeam === team || g.awayTeam === team)
  );
  if (!game) return null;
  return game.homeTeam === team ? game.awayTeam : game.homeTeam;
}

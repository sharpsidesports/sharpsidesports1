// server-only helper
// Weekly team-level pass attempts from nflverse's `stats_team` release.
// File: stats_team_week_{season}.csv

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { NflverseTeamWeekRow } from './types.js';

interface RawRow {
  team: string;
  opponent_team: string;
  season: string;
  week: string;
  season_type: string;
  game_id: string;
  attempts: string;
  completions: string;
  passing_yards: string;
  passing_tds: string;
  passing_interceptions: string;
  sacks_suffered: string;
  passing_air_yards: string;
  carries: string;
  rushing_yards: string;
}

export async function fetchStatsTeamWeek(
  season: number
): Promise<NflverseCsvResult<NflverseTeamWeekRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>(
    'stats_team',
    `stats_team_week_${season}.csv`
  );

  const mapped = rows
    .filter((r) => r.season_type === 'REG')
    .map((r): NflverseTeamWeekRow => ({
      team: r.team,
      opponentTeam: r.opponent_team,
      season: Number(r.season),
      week: Number(r.week),
      seasonType: r.season_type,
      gameId: r.game_id,
      passAttempts: Number(r.attempts) || 0,
      completions: Number(r.completions) || 0,
      passingYards: Number(r.passing_yards) || 0,
      passingTds: Number(r.passing_tds) || 0,
      passingInterceptions: Number(r.passing_interceptions) || 0,
      sacksSuffered: Number(r.sacks_suffered) || 0,
      passingAirYards: Number(r.passing_air_yards) || 0,
      carries: Number(r.carries) || 0,
      rushingYards: Number(r.rushing_yards) || 0,
    }));

  return { rows: mapped, fetchedAt, sourceUrl };
}

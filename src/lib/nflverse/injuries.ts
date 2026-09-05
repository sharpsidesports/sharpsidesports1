// server-only helper
// Weekly injury report status from nflverse's `injuries` release.
// File: injuries_{season}.csv

import { fetchNflverseCsv, type NflverseCsvResult } from './fetchCsv.js';
import type { NflverseInjuryRow } from './types.js';

interface RawRow {
  season: string;
  season_type: string;
  team: string;
  week: string;
  gsis_id: string;
  full_name: string;
  report_status: string;
  practice_status: string;
}

export async function fetchInjuries(
  season: number
): Promise<NflverseCsvResult<NflverseInjuryRow>> {
  const { rows, fetchedAt, sourceUrl } = await fetchNflverseCsv<RawRow>(
    'injuries',
    `injuries_${season}.csv`
  );

  const mapped = rows
    .filter((r) => r.season_type === 'REG')
    .map((r): NflverseInjuryRow => ({
      gsisId: r.gsis_id || null,
      playerName: r.full_name,
      team: r.team,
      season: Number(r.season),
      week: Number(r.week),
      reportStatus: r.report_status || null,
      practiceStatus: r.practice_status || null,
    }));

  return { rows: mapped, fetchedAt, sourceUrl };
}

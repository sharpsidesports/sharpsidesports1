import { parse } from 'csv-parse/browser/esm/sync';
import scoringStatsData from '../../data/scoring_stats.csv?raw';

export interface ScoringStats {
  player_full_name: string;
  statId: string;
  title: string;
  value: number;
  rank: number;
  category: string;
  fieldAverage?: number;
  year: number;
}

export function loadScoringStats(): ScoringStats[] {
  const records = parse(scoringStatsData, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map((record: any) => ({
    player_full_name: record.player_full_name,
    statId: record.statId,
    title: record.title,
    value: parseFloat(record.value),
    rank: parseInt(record.rank, 10),
    category: record.category,
    fieldAverage: record.fieldAverage ? parseFloat(record.fieldAverage) : undefined,
    year: parseInt(record.year, 10)
  }));
}


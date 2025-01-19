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

export const RELEVANT_STAT_IDS = [
  '02414', // Bogey Avoidance
  '02672', // Consecutive Birdies Streak
  '02673', // Consecutive Birdies/Eagles streak
  '106',   // Total Eagles
  '107',   // Total Birdies
  '112',   // Par 3 Birdie or Better Leaders
  '113',   // Par 4 Birdie or Better Leaders
  '114',   // Par 5 Birdie or Better Leaders
  '115',   // Birdie or Better Conversion Percentage
  '142',   // Par 3 Scoring Average
  '143',   // Par 4 Scoring Average
  '144',   // Par 5 Scoring Average
  '155',   // Eagles (Holes per)
  '156',   // Birdie Average
  '352',   // Birdie or Better Percentage
  '452'    // Consecutive Holes Below Par
];

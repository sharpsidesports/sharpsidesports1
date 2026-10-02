// Shared types + derived-field computation for the Anytime-TD model page.
// Pure/presentation-only: Volume, percentiles, and tiers are all computed
// here from fields api/nfl-odds.ts already returns — no model math changes.

import { percentileRank } from './percentileRank.js';
import { getTier, type Tier } from './tiers.js';

export type Zone = 'GOAL_LINE' | 'RED_ZONE' | 'FRINGE' | 'OPEN_FIELD';
export const ZONE_ORDER: Zone[] = ['GOAL_LINE', 'RED_ZONE', 'FRINGE', 'OPEN_FIELD'];
export const ZONE_LABELS: Record<Zone, string> = {
  GOAL_LINE: 'Goal Line (≤5)',
  RED_ZONE: 'Red Zone (6-20)',
  FRINGE: 'Fringe (21-40)',
  OPEN_FIELD: 'Open Field',
};

export interface ZoneBreakdownRow {
  zone: Zone;
  carries: number;
  targets: number;
  xTd: number;
}

export interface CombinedPlayer {
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
  implied_team_total: number | null;
  matchup_td_rate_allowed: number | null;
  sharp_score: number | null;
  zone_breakdown: ZoneBreakdownRow[] | null;
  expected_tds: number | null;
  scored: number | null;
  td_debt: number | null;
}

export interface ApiResponse {
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
  cached?: boolean;
  stale?: boolean;
  error?: string;
  details?: string;
}

export interface TdModelRow extends CombinedPlayer {
  volume: number; // season-to-date carries + targets, summed across zone_breakdown
  volumePercentile: number | null;
  tdDebtPercentile: number | null;
  edgePercentile: number | null;
  volumeTier: Tier;
  tdDebtTier: Tier;
  combinedScore: number; // average of volume/tdDebt percentiles (0 when both null) — default sort key
  isHighVolume: boolean; // Elite volume tier
  isDue: boolean; // Elite TD Debt tier
  isTopPlay: boolean; // Strong+ in both, and edge is null or positive
}

function sumVolume(p: CombinedPlayer): number {
  if (!p.zone_breakdown) return 0;
  return p.zone_breakdown.reduce((sum, z) => sum + z.carries + z.targets, 0);
}

// Computes Volume + percentile/tier/badge fields for every player in `pool`,
// percentiles ranked against that same pool (the caller passes the
// position-filtered + searched set, not the quick-filter-chip-narrowed set —
// see the plan's "percentile scope" note).
export function deriveTdModelRows(pool: CombinedPlayer[]): TdModelRow[] {
  const volumes = pool.map(sumVolume);
  const allVolumes = volumes;
  const allTdDebts = pool.map((p) => p.td_debt);
  const allEdges = pool.map((p) => p.edge);

  return pool.map((p, i) => {
    const volume = volumes[i];
    const volumePercentile = percentileRank(volume, allVolumes);
    const tdDebtPercentile = percentileRank(p.td_debt, allTdDebts);
    const edgePercentile = percentileRank(p.edge, allEdges);

    const volumeTier = getTier(volumePercentile);
    const tdDebtTier = getTier(tdDebtPercentile);

    const isHighVolume = volumeTier === 'elite';
    const isDue = tdDebtTier === 'elite';
    const bothStrongOrBetter =
      (volumeTier === 'elite' || volumeTier === 'strong') && (tdDebtTier === 'elite' || tdDebtTier === 'strong');
    const edgeOk = p.edge === null || p.edge > 0;
    const isTopPlay = bothStrongOrBetter && edgeOk;

    const combinedScore = ((volumePercentile ?? 0) + (tdDebtPercentile ?? 0)) / 2;

    return {
      ...p,
      volume,
      volumePercentile,
      tdDebtPercentile,
      edgePercentile,
      volumeTier,
      tdDebtTier,
      combinedScore,
      isHighVolume,
      isDue,
      isTopPlay,
    };
  });
}

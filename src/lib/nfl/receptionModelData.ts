// Shared types + derived-field computation for the Reception Model page.
// Pure/presentation-only: percentiles, tiers, and regression badges are all
// computed here from fields api/reception-model.ts already returns — no
// model math changes (Sharp Score itself is untouched).

import { percentileRank } from './percentileRank.js';
import { getTier, type Tier } from './tiers.js';

export interface ReceptionProjectionRow {
  espnId: string;
  playerName: string;
  team: string;
  opponentTeam: string | null;
  espnProjectedReceptions: number | null;
  expectedTargetShare: number | null;
  projectedTeamPassAttempts: number | null;
  projectedTargets: number | null;
  expectedCatchRate: number | null;
  nflverseProjectedReceptions: number | null;
  finalProjectedReceptionsRaw: number | null;
  projectedReceptions: number | null;
  receptionEdgeScore: number | null;
  projectionDifference: number | null;
  impliedTeamTotal: number | null;
  opponentTdRateAllowed: number | null;
  opponentCatchPctAllowed: number | null;
  opponentCatchPctAllowedToWr: number | null;
  targetsPerGame: number | null;
  catchPctSeason: number | null;
  receptionDebt: number | null;
  sharpScore: number | null;
  recentTargetShare: number | null;
  recentCatchPct: number | null;
  seasonTargetShareActual: number | null;
  recentGamesCount: number;
  recentTargets: number;
  roleTrendTargetShare: number | null;
  roleTrendGamesCount: number;
  recentOffenseSnapPct: number | null;
  avgSeparation: number | null;
  avgCushion: number | null;
  avgYacAboveExpectation: number | null;
  recentTeamProe: number | null;
  seasonTeamProe: number | null;
  dataSeason: number;
  dataWeek: number;
  dataLastUpdated: string | null;
  confidence: 'high' | 'medium' | 'low';
  fallbacksUsed: string[];
  warnings: string[];
  skipped?: 'OUT' | 'BYE';
}

// Role-trend threshold: a 3-percentage-point gap between the last 2 games'
// and season-long actual target share. Deliberately a shorter window than
// the 3-game recentTargetShare used for Buy Low/Unsustainable — a role trend
// should react faster than the efficiency signal does.
const ROLE_TREND_THRESHOLD = 0.03;
const ROLE_TREND_MIN_GAMES = 2;

// A 1-target/1-catch game is a 100% catch rate in the data but not a real
// efficiency signal — gate Buy Low/Unsustainable on a minimum recent target
// count so small-sample noise can't masquerade as a regression candidate.
const MIN_RECENT_TARGETS_FOR_EFFICIENCY_BADGE = 3;

// "Overlooked" gate: same minimum-recent-games bar as the role-trend badges.
const OVERLOOKED_MIN_GAMES = 2;

// Pass-rate-over-expected trend gate: a 5-percentage-point gap between a
// team's last-3-week and season-to-date neutral-script PROE. recentTeamProe
// is already null (from calculateTeamPassRateTrend.ts) when the recent
// sample is under ~one game's worth of neutral-script plays, so no separate
// sample-size gate is needed here.
const TEAM_PROE_TREND_THRESHOLD = 0.05;

export interface ReceptionModelRow extends ReceptionProjectionRow {
  targetSharePercentile: number | null;
  catchRatePercentile: number | null;
  targetShareTier: Tier;
  catchRateTier: Tier;
  regressionGap: number; // targetSharePercentile - catchRatePercentile; positive = Buy Low direction
  isBuyLow: boolean; // high recent target share, low recent catch rate — due for positive regression
  isUnsustainable: boolean; // low recent target share, high recent catch rate — efficiency likely to cool off
  isRoleClimbing: boolean;
  isRoleFading: boolean;
  snapSharePercentile: number | null;
  isOverlooked: boolean; // elite/strong recent snap share but low/neutral recent target share — on the field, not yet getting used
  isPassRateRebound: boolean; // team's recent neutral-script pass rate is well below their season norm — recent raw pass-attempt sample is likely script-suppressed, volume likely bounces back up
  isPassRateCooling: boolean; // team's recent neutral-script pass rate is well above their season norm — recent volume likely to normalize back down
}

export function deriveReceptionModelRows(pool: ReceptionProjectionRow[]): ReceptionModelRow[] {
  const allTargetShares = pool.map((p) => p.recentTargetShare);
  const allCatchPcts = pool.map((p) => p.recentCatchPct);
  const allSnapShares = pool.map((p) => p.recentOffenseSnapPct);

  return pool.map((p) => {
    const targetSharePercentile = percentileRank(p.recentTargetShare, allTargetShares);
    const catchRatePercentile = percentileRank(p.recentCatchPct, allCatchPcts);

    const targetShareTier = getTier(targetSharePercentile);
    const catchRateTier = getTier(catchRatePercentile);

    const hasEnoughSampleForEfficiencyBadge = p.recentTargets >= MIN_RECENT_TARGETS_FOR_EFFICIENCY_BADGE;
    const isBuyLow =
      hasEnoughSampleForEfficiencyBadge &&
      (targetShareTier === 'elite' || targetShareTier === 'strong') &&
      catchRateTier === 'low';
    const isUnsustainable =
      hasEnoughSampleForEfficiencyBadge &&
      targetShareTier === 'low' &&
      (catchRateTier === 'elite' || catchRateTier === 'strong');

    const hasEnoughRecentGames = p.roleTrendGamesCount >= ROLE_TREND_MIN_GAMES;
    const roleDelta =
      p.roleTrendTargetShare !== null && p.seasonTargetShareActual !== null
        ? p.roleTrendTargetShare - p.seasonTargetShareActual
        : null;
    const isRoleClimbing = hasEnoughRecentGames && roleDelta !== null && roleDelta >= ROLE_TREND_THRESHOLD;
    const isRoleFading = hasEnoughRecentGames && roleDelta !== null && roleDelta <= -ROLE_TREND_THRESHOLD;

    const regressionGap = (targetSharePercentile ?? 0) - (catchRatePercentile ?? 0);

    const snapSharePercentile = percentileRank(p.recentOffenseSnapPct, allSnapShares);
    const snapShareTier = getTier(snapSharePercentile);
    const isOverlooked =
      p.recentGamesCount >= OVERLOOKED_MIN_GAMES &&
      (snapShareTier === 'elite' || snapShareTier === 'strong') &&
      (targetShareTier === 'low' || targetShareTier === 'neutral');

    const teamProeDelta =
      p.recentTeamProe !== null && p.seasonTeamProe !== null ? p.recentTeamProe - p.seasonTeamProe : null;
    const isPassRateRebound = teamProeDelta !== null && teamProeDelta <= -TEAM_PROE_TREND_THRESHOLD;
    const isPassRateCooling = teamProeDelta !== null && teamProeDelta >= TEAM_PROE_TREND_THRESHOLD;

    return {
      ...p,
      targetSharePercentile,
      catchRatePercentile,
      targetShareTier,
      catchRateTier,
      regressionGap,
      isBuyLow,
      isUnsustainable,
      isRoleClimbing,
      isRoleFading,
      snapSharePercentile,
      isOverlooked,
      isPassRateRebound,
      isPassRateCooling,
    };
  });
}

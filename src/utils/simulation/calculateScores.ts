import { Golfer } from '../../types/golf.js';
import { SharpsideMetric, MetricWeight, METRIC_CATEGORIES } from '../../types/metrics.js';
import { calculateImpliedProbability } from '../calculations/oddsCalculator.js';

const calculateMetricValue = (golfer: Golfer, metric: SharpsideMetric): number => {
  switch (metric) {
    // General metrics
    case 'Total':
      return golfer.strokesGainedTotal;
    case 'OTT':
      return golfer.strokesGainedTee;
    case 'APP':
      return golfer.strokesGainedApproach;
    case 'ARG':
      return golfer.strokesGainedAround;
    case 'P':
      return golfer.strokesGainedPutting;
    case 'gir':
      return golfer.gir;
    case 'DrivingAcc':
      return golfer.drivingAccuracy;
    case 'DrivingDist':
      return golfer.drivingDistance;  
    case 'T2G':
      return golfer.strokesGainedTotal - golfer.strokesGainedPutting;
    case 'BS':
      return golfer.strokesGainedTee + golfer.strokesGainedApproach;
    
    // Proximity metrics
    case 'Prox100_125':
      return golfer.proximityMetrics['100-125'];
    case 'Prox125_150':
      return golfer.proximityMetrics['125-150'];
    case 'Prox175_200':
      return golfer.proximityMetrics['175-200'];
    case 'Prox200_225':
      return golfer.proximityMetrics['200-225'];
    case 'Prox225Plus':
      return golfer.proximityMetrics['225plus'];
    
    // Scoring metrics
    case 'BogeyAvoid':
      return golfer.scoringStats?.bogeyAvoidance ?? 0;
    case 'TotalBirdies':
      return golfer.scoringStats?.totalBirdies ?? 0;
    case 'Par3BirdieOrBetter':
      return golfer.scoringStats?.par3BirdieOrBetter ?? 0;
    case 'Par4BirdieOrBetter':
      return golfer.scoringStats?.par4BirdieOrBetter ?? 0;
    case 'Par5BirdieOrBetter':
      return golfer.scoringStats?.par5BirdieOrBetter ?? 0;
    case 'BirdieConversion':
      return golfer.scoringStats?.birdieOrBetterConversion ?? 0;
    case 'Par3Scoring':
      return golfer.scoringStats?.par3ScoringAvg ?? 0;
    case 'Par4Scoring':
      return golfer.scoringStats?.par4ScoringAvg ?? 0;
    case 'Par5Scoring':
      return golfer.scoringStats?.par5ScoringAvg ?? 0;
    case 'EaglesPerHole':
      return golfer.scoringStats?.eaglesPerHole ?? 0;
    case 'BirdieAvg':
      return golfer.scoringStats?.birdieAverage ?? 0;
    case 'BirdieOrBetterPct':
      return golfer.scoringStats?.birdieOrBetterPercentage ?? 0;

    default:
      return 0;
  }
};

// Determine if a higher value is better for a given metric
/*const isHigherBetter = (metric: SharpsideMetric): boolean => {
  // For these metrics, lower values are better
  const lowerIsBetter = [
    'Prox100_125', 'Prox125_150', 'Prox175_200', 'Prox200_225', 'Prox225Plus',
    'Par3Scoring', 'Par4Scoring', 'Par5Scoring'
  ];
  
  return !lowerIsBetter.includes(metric);
};*/

// Used for caching odds ranks
//let cachedOddsRanks: Map<string, number> | null = null;
//let cachedNormalizedProbs: Map<string, number> | null = null;

// Reset the cache when needed (e.g., when golfer data changes)
export const resetOddsCache = () => {
  //cachedOddsRanks = null;
  //cachedNormalizedProbs = null;
};

// Calculate ranks for all golfers for each metric
export const calculateRanks = (golfers: Golfer[], metrics: SharpsideMetric[]): Map<string, Map<SharpsideMetric, number>> => {
  // Create a map to hold all ranks
  const ranks = new Map<string, Map<SharpsideMetric, number>>();
  
  // Initialize maps for each golfer
  golfers.forEach(golfer => {
    ranks.set(golfer.id, new Map<SharpsideMetric, number>());
  });
  
  // Calculate ranks for each metric
  metrics.forEach(metric => {
    // Get values for this metric for all golfers
    const golferValues = golfers.map(golfer => ({
      id: golfer.id,
      value: calculateMetricValue(golfer, metric)
    }));
    
    // Sort golfers by metric value
    const sortedGolfers = [...golferValues].sort((a, b) => {
      // Handle missing values - place them at the end
      if (a.value === undefined || a.value === null) return 1;
      if (b.value === undefined || b.value === null) return -1;
      
      // For most metrics, higher value is better
      // For Bogey%, Double Bogey%, or any 'negative' metric, lower is better
      const isNegativeMetric = metric === 'bogeyPercent' || metric === 'doubleBogeyPercent';
      return isNegativeMetric 
        ? a.value - b.value  // Lower is better for negative metrics
        : b.value - a.value; // Higher is better for positive metrics
    });
    
    // Assign ranks
    sortedGolfers.forEach((golfer, index) => {
      const golferRanks = ranks.get(golfer.id);
      if (golferRanks) {
        golferRanks.set(metric, index + 1);
      }
    });
  });
  
  return ranks;
};

export const calculateSimulatedScore = (
  golfer: Golfer,
  weights: MetricWeight[],
  randomFactor: number,
  allGolfers: Golfer[] = [], // Add all golfers parameter for ranking
): number => {
  // If no golfers provided or only one golfer, fall back to original calculation
  if (allGolfers.length <= 1) {
    return calculateLegacySimulatedScore(golfer, weights, randomFactor);
  }
  
  // Get active metrics from weights
  const activeMetrics = weights
    .filter(weight => weight.weight > 0)
    .map(weight => weight.metric);
  
  // Calculate ranks for all golfers for each metric
  const metricRanks = calculateRanks(allGolfers, activeMetrics);
  
  // Get this golfer's ranks
  const golferRanks = metricRanks.get(golfer.id);
  if (!golferRanks) {
    return calculateLegacySimulatedScore(golfer, weights, randomFactor);
  }
  
  // Calculate average stats rank (weighted by the specified weights)
  let totalWeight = 0;
  let weightedRankSum = 0;
  
  weights.forEach(weightItem => {
    if (weightItem.weight > 0) {
      const rank = golferRanks.get(weightItem.metric) || 0;
      if (rank > 0) {
        weightedRankSum += rank * (weightItem.weight / 100);
        totalWeight += weightItem.weight / 100;
      }
    }
  });
  
  const averageStatsRank = totalWeight > 0 ? weightedRankSum / totalWeight : 0;
  
  // Get the raw implied probability for this golfer
  const impliedProb = golfer.odds?.impliedProbability || 
                     (golfer.odds?.fanduel ? calculateImpliedProbability(golfer.odds.fanduel) : 0);
  
  // Simplified calculation: combine stats rank and implied probability directly
  // Normalize stats rank to 0-100 scale (lower is better)
  const normStatsRank = (averageStatsRank / allGolfers.length) * 100;
  
  // Create a score based on 70% stats rank and 30% implied probability
  // This balances player statistics with some influence from betting odds
  // For both components, lower score is better
  const baseScore = (normStatsRank * 0.30) + ((1 - impliedProb) * 100 * 0.70);
  
  // Add randomness with less computation
  // More random variation for lower-ranked players
  const randomComponent = randomFactor * (0.2 + (1 - impliedProb) * 0.5);
  
  // Return final score - lower is better
  return baseScore * (1 + randomComponent);
};

// Keep the original calculation method for backward compatibility
const calculateLegacySimulatedScore = (
  golfer: Golfer,
  weights: MetricWeight[],
  randomFactor: number,
): number => {
  const strokesGainedScore = weights.reduce((score, metricWeight) => {
    if (METRIC_CATEGORIES.COURSE.includes(metricWeight.metric)) {
      const sgValue = calculateMetricValue(golfer, metricWeight.metric);
      const weightedValue = -(sgValue * (metricWeight.weight / 100));
      return score + weightedValue;
    }
    return score;
  }, 0);
  
  const proximityScore = weights.reduce((score, metricWeight) => {
    if (METRIC_CATEGORIES.PROXIMITY.includes(metricWeight.metric)) {
      const proximityValue = calculateMetricValue(golfer, metricWeight.metric);
      const weightedValue = proximityValue * (metricWeight.weight / 100);
      return score + weightedValue;
    }
    return score;
  }, 0);

  const scoringScore = weights.reduce((score, metricWeight) => {
    if (METRIC_CATEGORIES.SCORING.includes(metricWeight.metric)) {
      const scoringValue = calculateMetricValue(golfer, metricWeight.metric);
      // For scoring averages (par 3/4/5), higher is worse
      const isScoring = ['Par3Scoring', 'Par4Scoring', 'Par5Scoring'].includes(metricWeight.metric);
      const weightedValue = scoringValue * (metricWeight.weight / 100);
      return score + (isScoring ? weightedValue : -weightedValue);
    }
    return score;
  }, 0);

  // Calculate base score
  const baseScore = strokesGainedScore + proximityScore + scoringScore;
  
  // Apply random factor with diminishing effect based on player skill
  // Better players (lower base scores) should have less variance
  const varianceFactor = Math.abs(baseScore) < 1 ? 0.4 : 0.3;
  return baseScore * (1 + randomFactor * varianceFactor);
};
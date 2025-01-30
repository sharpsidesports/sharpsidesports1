import { Golfer } from '../../types/golf';
import { SharpsideMetric, MetricWeight, METRIC_CATEGORIES } from '../../types/metrics';

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

export const calculateSimulatedScore = (
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

  return (strokesGainedScore + proximityScore + scoringScore) * (1 + randomFactor * 1.3);
};
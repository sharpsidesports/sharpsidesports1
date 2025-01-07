import { Golfer } from '../../types/golf';
import { SharpsideMetric, MetricWeight, METRIC_CATEGORIES } from '../../types/metrics';

const calculateMetricValue = (golfer: Golfer, metric: SharpsideMetric): number => {
  switch (metric) {
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
    case 'DrivingAcc':
      return golfer.drivingAccuracy;
    case 'DrivingDist':
      return golfer.drivingDistance;  
    case 'T2G':
      return golfer.strokesGainedTotal - golfer.strokesGainedPutting;
    case 'BS':
      return golfer.strokesGainedTee + golfer.strokesGainedApproach;
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
    if (METRIC_CATEGORIES.GENERAL.includes(metricWeight.metric)) {
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

  // console.log(strokesGainedScore, strokesGainedScore + proximityScore, golfer.name);
  return (strokesGainedScore + proximityScore ) 
  * (1 + randomFactor * 1.3)
  ;
};
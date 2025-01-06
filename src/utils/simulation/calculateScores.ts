import { Golfer } from '../../types/golf';
import { SGMetric, MetricWeight, METRIC_CATEGORIES } from '../../types/metrics';

const calculateMetricValue = (golfer: Golfer, metric: SGMetric): number => {
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
    case 'T2G':
      return golfer.strokesGainedTotal - golfer.strokesGainedPutting;
    case 'BS':
      return golfer.strokesGainedTee + golfer.strokesGainedApproach;
    case 'Prox100_125':
      return golfer.proximityStats['100-125'];
    case 'Prox125_150':
      return golfer.proximityStats['125-150'];
    case 'Prox175_200':
      return golfer.proximityStats['175-200'];
    case 'Prox200_225':
      return golfer.proximityStats['200-225'];
    case 'Prox225Plus':
      return golfer.proximityStats['225plus'];
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
      const weightedValue = sgValue * (metricWeight.weight / 100);
      // console.log(score, weightedValue, golfer.name);
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

  console.log(strokesGainedScore, strokesGainedScore + proximityScore, golfer.name);
  return (strokesGainedScore + proximityScore ) 
  // * (1 + randomFactor * 1.5)
  ;
};
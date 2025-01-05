import { Golfer } from '../../types/golf';
import { SGMetric, MetricWeight, METRIC_CATEGORIES } from '../../types/metrics';

const calculateMetricValue = (golfer: Golfer, metric: SGMetric, selectedCourses: string[]): number => {
  let baseValue = 0;
  let courseAdjustedValue = 0;
  let courseCount = 0;

  // Calculate base value from overall stats
  switch (metric) {
    case 'Total':
      baseValue = golfer.strokesGainedTotal;
      break;
    case 'OTT':
      baseValue = golfer.strokesGainedTee;
      break;
    case 'APP':
      baseValue = golfer.strokesGainedApproach;
      break;
    case 'ARG':
      baseValue = golfer.strokesGainedAround;
      break;
    case 'P':
      baseValue = golfer.strokesGainedPutting;
      break;
    case 'T2G':
      baseValue = golfer.strokesGainedTotal - golfer.strokesGainedPutting;
      break;
    case 'BS':
      baseValue = golfer.strokesGainedTee + golfer.strokesGainedApproach;
      break;
    case 'Prox100_125':
      baseValue = golfer.proximityStats['100-125'];
      break;
    case 'Prox125_150':
      baseValue = golfer.proximityStats['125-150'];
      break;
    case 'Prox175_200':
      baseValue = golfer.proximityStats['175-200'];
      break;
    case 'Prox200_225':
      baseValue = golfer.proximityStats['200-225'];
      break;
    case 'Prox225Plus':
      baseValue = golfer.proximityStats['225plus'];
      break;
    default:
      baseValue = 0;
  }

  // Adjust based on recent rounds on selected courses
  selectedCourses.forEach(course => {
    console.log(course);
    if (golfer.recentRounds[course]) {
      const rounds = golfer.recentRounds[course].rounds;
      rounds.forEach(round => {
        switch (metric) {
          case 'Total':
            courseAdjustedValue += round.sg_total;
            break;
          case 'OTT':
            courseAdjustedValue += round.sg_ott;
            break;
          case 'APP':
            courseAdjustedValue += round.sg_app;
            break;
          case 'ARG':
            courseAdjustedValue += round.sg_arg;
            break;
          case 'P':
            courseAdjustedValue += round.sg_putt;
            break;
          case 'T2G':
            courseAdjustedValue += round.sg_t2g;
            break;
          // Add cases for proximity metrics if needed
        }
        courseCount++;
      });
    }
  });

  if (courseCount > 0) {
    courseAdjustedValue /= courseCount;
  }

  // Combine base value with course-adjusted value
  return baseValue * 0.5 + courseAdjustedValue * 0.5;
};

export const calculateSimulatedScore = (
  golfer: Golfer,
  weights: MetricWeight[],
  randomFactor: number,
  selectedCourses: string[]
): number => {
  const strokesGainedScore = weights.reduce((score, metricWeight) => {
    if (METRIC_CATEGORIES.GENERAL.includes(metricWeight.metric)) {
      const value = calculateMetricValue(golfer, metricWeight.metric, selectedCourses);
      const weightedValue = value * (metricWeight.weight / 100);
      return score + weightedValue;
    }
    return score;
  }, 0);
  
  const proximityScore = weights.reduce((score, metricWeight) => {
    if (METRIC_CATEGORIES.PROXIMITY.includes(metricWeight.metric)) {
      const proximityValue = calculateMetricValue(golfer, metricWeight.metric, selectedCourses);
      const weightedValue = proximityValue * (metricWeight.weight / 100);
      return score + weightedValue;
    }
    return score;
  }, 0);

  return (strokesGainedScore + proximityScore ) * (1 + randomFactor * 1.5);
};
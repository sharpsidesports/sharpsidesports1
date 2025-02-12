import { useMemo } from 'react';
import { useGolfStore } from '../../../store/useGolfStore';

export interface StrokesGainedMetric {
  name: string;
  percentage: number;
  description: string;
}

export function useStrokesGainedData() {
  const { golfers } = useGolfStore();

  const strokesGainedData = useMemo<StrokesGainedMetric[]>(() => {
    if (!golfers || golfers.length === 0) return [];

    // Calculate average stats for all golfers
    const avgStats = golfers.reduce((acc, golfer) => {
      // Normalize driving distance to a 0-1 scale based on typical PGA Tour ranges
      // Typical PGA driving distances range from ~280 to ~320 yards
      const normalizedDrivingDistance = (golfer.drivingDistance - 280) / (320 - 280);
      acc.drivingDistance += Math.max(0, Math.min(1, normalizedDrivingDistance));
      
      // Keep accuracy as percentage (0-100)
      acc.drivingAccuracy += golfer.drivingAccuracy;
      acc.approach += Math.abs(golfer.strokesGainedApproach);
      acc.around += Math.abs(golfer.strokesGainedAround);
      acc.putting += Math.abs(golfer.strokesGainedPutting);
      return acc;
    }, {
      drivingDistance: 0,
      drivingAccuracy: 0,
      approach: 0,
      around: 0,
      putting: 0
    });

    // Calculate averages
    const avgDrivingDistance = avgStats.drivingDistance / golfers.length;
    const avgDrivingAccuracy = avgStats.drivingAccuracy / golfers.length;
    const avgApproach = avgStats.approach / golfers.length;
    const avgAround = avgStats.around / golfers.length;
    const avgPutting = avgStats.putting / golfers.length;

    // Scale factors to make metrics comparable
    const drivingDistanceWeight = 1;
    const drivingAccuracyWeight = 1;
    const approachWeight = 1;
    const aroundWeight = 1;
    const puttingWeight = 1;

    // Calculate weighted sum for percentage calculation
    const weightedSum = 
      (avgDrivingDistance * drivingDistanceWeight) +
      (avgDrivingAccuracy * drivingAccuracyWeight) +
      (avgApproach * approachWeight) +
      (avgAround * aroundWeight) +
      (avgPutting * puttingWeight);

    const metrics = [
      {
        name: 'Driving Distance',
        percentage: (avgDrivingDistance * drivingDistanceWeight) / weightedSum,
        description: 'Average driving distance in yards'
      },
      {
        name: 'Driving Accuracy',
        percentage: (avgDrivingAccuracy * drivingAccuracyWeight) / weightedSum,
        description: 'Percentage of fairways hit off the tee'
      },
      {
        name: 'SG: Approach',
        percentage: (avgApproach * approachWeight) / weightedSum,
        description: 'Performance on approach shots to the green'
      },
      {
        name: 'SG: Around Green',
        percentage: (avgAround * aroundWeight) / weightedSum,
        description: 'Performance on shots within 30 yards of the green'
      },
      {
        name: 'SG: Putting',
        percentage: (avgPutting * puttingWeight) / weightedSum,
        description: 'Performance on putts on the green'
      }
    ];

    // Sort metrics by percentage in descending order
    return metrics.sort((a, b) => b.percentage - a.percentage);
  }, [golfers]);

  return { strokesGainedData, isLoading: !golfers.length };
}
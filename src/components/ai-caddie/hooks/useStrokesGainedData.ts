import { useMemo, useEffect, useState } from 'react';
import { useGolfStore } from '../../../store/useGolfStore';
import { googleSheetsService } from '../../../services/api/googleSheetsService';
import { CourseWeights } from '../../../types/golf';

export interface StrokesGainedMetric {
  name: string;
  percentage: number;
  description: string;
}

export function useStrokesGainedData() {
  const { golfers } = useGolfStore();
  const [courseWeights, setCourseWeights] = useState<CourseWeights | null>(null);

  useEffect(() => {
    const fetchWeights = async () => {
      const weights = await googleSheetsService.getCourseWeights();
      setCourseWeights(weights);
    };
    fetchWeights();
  }, []);

  const strokesGainedData = useMemo<StrokesGainedMetric[]>(() => {
    if (!golfers || golfers.length === 0) return [];

    // Get top 10 players by strokes gained total in the current field
    const top10Players = [...golfers]
      .sort((a, b) => b.strokesGainedTotal - a.strokesGainedTotal)
      .slice(0, 10);

    // Calculate average stats for top 10 players
    const avgStats = top10Players.reduce((acc, golfer) => {
      acc.ott += Math.abs(golfer.strokesGainedTee);
      acc.approach += Math.abs(golfer.strokesGainedApproach);
      acc.around += Math.abs(golfer.strokesGainedAround);
      acc.putting += Math.abs(golfer.strokesGainedPutting);
      return acc;
    }, {
      ott: 0,
      approach: 0,
      around: 0,
      putting: 0
    });

    // Calculate averages
    const avgOtt = avgStats.ott / top10Players.length;
    const avgApproach = avgStats.approach / top10Players.length;
    const avgAround = avgStats.around / top10Players.length;
    const avgPutting = avgStats.putting / top10Players.length;

    // Use weights from Google Sheets if available, otherwise use defaults
    const weights = courseWeights || {
      ottWeight: 1,
      approachWeight: 1,
      aroundGreenWeight: 1,
      puttingWeight: 1
    };

    // Calculate weighted sum for percentage calculation
    const weightedSum = 
      (avgOtt * weights.ottWeight) +
      (avgApproach * weights.approachWeight) +
      (avgAround * weights.aroundGreenWeight) +
      (avgPutting * weights.puttingWeight);

    const metrics = [
      {
        name: 'SG: Off the Tee',
        percentage: (avgOtt * weights.ottWeight) / weightedSum,
        description: 'Performance on tee shots'
      },
      {
        name: 'SG: Approach',
        percentage: (avgApproach * weights.approachWeight) / weightedSum,
        description: 'Performance on approach shots to the green'
      },
      {
        name: 'SG: Around Green',
        percentage: (avgAround * weights.aroundGreenWeight) / weightedSum,
        description: 'Performance on shots within 30 yards of the green'
      },
      {
        name: 'SG: Putting',
        percentage: (avgPutting * weights.puttingWeight) / weightedSum,
        description: 'Performance on putts on the green'
      }
    ];

    // Sort metrics by percentage in descending order
    return metrics.sort((a, b) => b.percentage - a.percentage);
  }, [golfers, courseWeights]);

  return { 
    strokesGainedData, 
    isLoading: !golfers.length,
    courseWeights,
    lastUpdated: courseWeights?.lastUpdated 
  };
}
import { useMemo, useEffect, useState } from 'react';
import { useGolfStore } from '../../../store/useGolfStore.js';
import { googleSheetsService } from '../../../services/api/googleSheetsService.js';
import { CourseWeights } from '../../../types/golf.js';

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

  // Directly use the percentages from the Google Sheet (courseWeights)
  const strokesGainedData = useMemo<StrokesGainedMetric[]>(() => {
    if (!courseWeights) return [];

    return [
      {
        name: 'SG: Off the Tee',
        percentage: courseWeights.ottWeight, // Already a decimal (e.g., 0.24 for 24%)
        description: 'Performance on tee shots'
      },
      {
        name: 'SG: Approach',
        percentage: courseWeights.approachWeight,
        description: 'Performance on approach shots to the green'
      },
      {
        name: 'SG: Around Green',
        percentage: courseWeights.aroundGreenWeight,
        description: 'Performance on shots within 30 yards of the green'
      },
      {
        name: 'SG: Putting',
        percentage: courseWeights.puttingWeight,
        description: 'Performance on putts on the green'
      }
    ];
  }, [courseWeights]);

  return { 
    strokesGainedData, 
    isLoading: !courseWeights,
    courseWeights,
    lastUpdated: courseWeights?.lastUpdated 
  };
}
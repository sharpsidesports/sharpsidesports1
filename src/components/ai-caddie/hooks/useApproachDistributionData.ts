import { useEffect, useMemo, useState } from 'react';
import { useGolfStore } from '../../../store/useGolfStore';
import { ApproachDistributionMetric, ApproachDistributionWeights } from '../../../types/golf';
import { googleSheetsService } from '../../../services/api/googleSheetsService';

const DEFAULT_WEIGHTS: ApproachDistributionWeights = {
  courseName: 'Default',
  prox100_125Weight: 0.094,  // 9.40%
  prox125_150Weight: 0.146,  // 14.60%
  prox150_175Weight: 0.212,  // 21.20%
  prox175_200Weight: 0.169,  // 16.90%
  prox200_225Weight: 0.144,  // 14.40%
  prox225plusWeight: 0.182,  // 18.20%
  lastUpdated: new Date().toISOString()
};

export function useApproachDistributionData() {
  const { golfers } = useGolfStore();
  const [weights, setWeights] = useState<ApproachDistributionWeights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    const fetchWeights = async () => {
      const fetchedWeights = await googleSheetsService.getApproachDistributionWeights();
      if (fetchedWeights) {
        setWeights(fetchedWeights);
      }
    };

    fetchWeights();
  }, []);

  const approachDistributionData = useMemo<ApproachDistributionMetric[]>(() => {
    if (!golfers || golfers.length === 0) return [];

    const metrics = [
      {
        name: 'Proximity 100-125 yards',
        percentage: weights.prox100_125Weight,
        description: 'Approach shots from 100-125 yards'
      },
      {
        name: 'Proximity 125-150 yards',
        percentage: weights.prox125_150Weight,
        description: 'Approach shots from 125-150 yards'
      },
      {
        name: 'Proximity 150-175 yards',
        percentage: weights.prox150_175Weight,
        description: 'Approach shots from 150-175 yards'
      },
      {
        name: 'Proximity 175-200 yards',
        percentage: weights.prox175_200Weight,
        description: 'Approach shots from 175-200 yards'
      },
      {
        name: 'Proximity 200-225 yards',
        percentage: weights.prox200_225Weight,
        description: 'Approach shots from 200-225 yards'
      },
      {
        name: 'Proximity 225+ yards',
        percentage: weights.prox225plusWeight,
        description: 'Approach shots from 225+ yards'
      }
    ];

    // Sort metrics by percentage in descending order
    return metrics.sort((a, b) => b.percentage - a.percentage);
  }, [golfers, weights]);

  return {
    approachDistributionData,
    isLoading: !golfers.length,
    weights,
    lastUpdated: weights.lastUpdated
  };
} 
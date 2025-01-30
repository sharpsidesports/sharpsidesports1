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

    // Calculate average strokes gained for all golfers
    const avgStrokesGained = golfers.reduce((acc, golfer) => {
      acc.total += Math.abs(golfer.strokesGainedTotal);
      acc.tee += Math.abs(golfer.strokesGainedTee);
      acc.approach += Math.abs(golfer.strokesGainedApproach);
      acc.around += Math.abs(golfer.strokesGainedAround);
      acc.putting += Math.abs(golfer.strokesGainedPutting);
      return acc;
    }, {
      total: 0,
      tee: 0,
      approach: 0,
      around: 0,
      putting: 0
    });

    // Calculate total for percentage calculation
    const sum = avgStrokesGained.tee + avgStrokesGained.approach + 
                avgStrokesGained.around + avgStrokesGained.putting;

    return [
      {
        name: 'SG: Total',
        percentage: avgStrokesGained.total / (sum * golfers.length),
        description: 'Overall performance across all aspects of the game'
      },
      {
        name: 'SG: Off the Tee',
        percentage: avgStrokesGained.tee / (sum * golfers.length),
        description: 'Performance on all tee shots, primarily on par 4s and 5s'
      },
      {
        name: 'SG: Approach',
        percentage: avgStrokesGained.approach / (sum * golfers.length),
        description: 'Performance on approach shots to the green'
      },
      {
        name: 'SG: Around Green',
        percentage: avgStrokesGained.around / (sum * golfers.length),
        description: 'Performance on shots within 30 yards of the green'
      },
      {
        name: 'SG: Putting',
        percentage: avgStrokesGained.putting / (sum * golfers.length),
        description: 'Performance on putts on the green'
      }
    ];
  }, [golfers]);

  return { strokesGainedData, isLoading: !golfers.length };
}
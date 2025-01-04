import { useMemo } from 'react';

interface StrokesGainedMetric {
  name: string;
  percentage: number;
  description: string;
}

export function useStrokesGainedData() {
  const strokesGainedData = useMemo<StrokesGainedMetric[]>(() => [
    {
      name: 'SG: Total',
      percentage: 0.20,
      description: 'Overall performance across all aspects of the game'
    },
    {
      name: 'SG: Off the Tee',
      percentage: 0.15,
      description: 'Performance on all tee shots, primarily on par 4s and 5s'
    },
    {
      name: 'SG: Approach',
      percentage: 0.25,
      description: 'Performance on approach shots to the green'
    },
    {
      name: 'SG: Around Green',
      percentage: 0.15,
      description: 'Performance on shots within 30 yards of the green'
    },
    {
      name: 'SG: Tee to Green',
      percentage: 0.10,
      description: 'Combined performance from tee to green, excluding putting'
    },
    {
      name: 'SG: Putting',
      percentage: 0.10,
      description: 'Performance on putts on the green'
    },
    {
      name: 'SG: Ball Striking',
      percentage: 0.05,
      description: 'Combined performance of driving and approach play'
    }
  ], []);

  return {
    strokesGainedData
  };
}
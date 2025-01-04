import { Golfer } from '../../types/golf';
import { simulateMultipleRounds } from './simulateRound';
import { MetricWeight } from '../../types/metrics';

export const simulateGolfers = (golfers: Golfer[], weights: MetricWeight[], selectedCourses: string[]): Golfer[] => {
  const simulatedGolfers = golfers.map(golfer => {
    const { averageFinish, winPercentage } = simulateMultipleRounds(
      golfer,
      weights,
      1000,
      golfers,
      selectedCourses
    );

    return {
      ...golfer,
      simulatedRank: averageFinish,
      simulationStats: {
        ...golfer.simulationStats,
        averageFinish,
        winPercentage
      }
    };
  });

  const sortedGolfers = simulatedGolfers.sort((a, b) => a.simulatedRank - b.simulatedRank);
  return sortedGolfers;
};
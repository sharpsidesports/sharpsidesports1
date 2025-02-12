import { Golfer } from '../../types/golf';
import { simulateMultipleRounds } from './simulateRound';
import { MetricWeight } from '../../types/metrics';

export const simulateGolfers = (golfers: Golfer[], weights: MetricWeight[], roundRange: number = 12): Golfer[] => {
  const simulatedGolfers = golfers.map(golfer => {
    const { averageFinish, winPercentage, top10Percentage } = simulateMultipleRounds(
      golfer,
      weights,
      1000,
      golfers,
      roundRange
    );

    return {
      ...golfer,
      simulatedRank: averageFinish,
      simulationStats: {
        ...golfer.simulationStats,
        averageFinish,
        winPercentage,
        top10Percentage
      }
    };
  });

  const sortedGolfers = simulatedGolfers.sort((a, b) => a.simulatedRank - b.simulatedRank);
  return sortedGolfers;
};
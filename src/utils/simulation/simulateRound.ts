import { Golfer } from '../../types/golf';
import { MetricWeight } from '../../types/metrics';
import { calculateSimulatedScore } from './calculateScores';
import { generateRandomFactor } from '../random';

export const simulateRound = (golfer: Golfer, weights: MetricWeight[], ) => {
  return calculateSimulatedScore(golfer, weights, generateRandomFactor());
};

export const simulateMultipleRounds = (
  golfer: Golfer,
  weights: MetricWeight[],
  numRounds: number,
  competitors: Golfer[],
  roundRange: number = 12
) => {
  // Sample only the last roundRange number of rounds for more recent performance
  const recentGolferData = {
    ...golfer,
    // Add logic here to filter recent rounds if we add historical round tracking
  };

  let totalPosition = 0;
  let wins = 0;

  for (let i = 0; i < numRounds; i++) {
    const simulatedScore = simulateRound(recentGolferData, weights);
    totalPosition += simulatedScore;

    const otherScores = competitors
      .filter(g => g.id !== golfer.id)
      .map(g => simulateRound(g, weights));

    if (otherScores.every(score => simulatedScore < score)) {
      wins++;
    }
  }

  const averageFinish = totalPosition / numRounds;
  const winPercentage = (wins / numRounds) * 100;

  return {
    averageFinish,
    winPercentage
  };
};
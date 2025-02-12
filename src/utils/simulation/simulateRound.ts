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
  let top10Finishes = 0;

  for (let i = 0; i < numRounds; i++) {
    const simulatedScore = simulateRound(recentGolferData, weights);
    totalPosition += simulatedScore;

    const otherScores = competitors
      .filter(g => g.id !== golfer.id)
      .map(g => simulateRound(g, weights));

    // Count how many competitors beat this golfer
    const position = otherScores.filter(score => score < simulatedScore).length + 1;
    
    if (position === 1) {
      wins++;
    }
    if (position <= 10) {
      top10Finishes++;
    }
  }

  const averageFinish = totalPosition / numRounds;
  const winPercentage = (wins / numRounds) * 100;
  const top10Percentage = (top10Finishes / numRounds) * 100;

  return {
    averageFinish,
    winPercentage,
    top10Percentage
  };
};
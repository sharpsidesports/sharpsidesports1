import { Golfer } from '../../types/golf';
import { MetricWeight } from '../../types/metrics';
import { calculateSimulatedScore } from './calculateScores';
import { generateRandomFactor } from '../random';

export const simulateRound = (golfer: Golfer, weights: MetricWeight[], selectedCourses: string[]) => {
  return calculateSimulatedScore(golfer, weights, generateRandomFactor(), selectedCourses);
};

export const simulateMultipleRounds = (
  golfer: Golfer,
  weights: MetricWeight[],
  numRounds: number,
  competitors: Golfer[],
  selectedCourses: string[]
) => {
  let totalPosition = 0;
  let wins = 0;

  for (let i = 0; i < numRounds; i++) {
    const simulatedScore = simulateRound(golfer, weights, selectedCourses);
    totalPosition += simulatedScore;

    const otherScores = competitors
      .filter(g => g.id !== golfer.id)
      .map(g => simulateRound(g, weights, selectedCourses));

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
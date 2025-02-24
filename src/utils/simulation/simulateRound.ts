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
  let top25Finishes = 0;
  let totalScore = 0;

  // Pre-calculate competitor base stats for efficiency
  const competitorStats = competitors
    .filter(g => g.id !== golfer.id)
    .map(g => ({
      id: g.id,
      baseScore: calculateSimulatedScore(g, weights, 0) // Get base score without random factor
    }));

  for (let i = 0; i < numRounds; i++) {
    // Simulate this golfer's round
    const simulatedScore = simulateRound(recentGolferData, weights);
    totalScore += simulatedScore;

    // Simulate competitor rounds
    const roundScores = competitorStats.map(comp => ({
      id: comp.id,
      score: comp.baseScore * (1 + generateRandomFactor() * 0.3) // Apply random factor to base score
    }));

    // Count how many competitors beat this golfer
    const position = roundScores.filter(score => score.score < simulatedScore).length + 1;
    totalPosition += position;
    
    if (position === 1) {
      wins++;
    }
    if (position <= 10) {
      top10Finishes++;
    }
    if (position <= 25) {
      top25Finishes++;
    }
  }

  const averageFinish = totalPosition / numRounds;
  const winPercentage = (wins / numRounds) * 100;
  const top10Percentage = (top10Finishes / numRounds) * 100;
  const top25Percentage = (top25Finishes / numRounds) * 100;
  const averageScore = totalScore / numRounds;

  return {
    averageFinish,
    winPercentage,
    top10Percentage,
    top25Percentage,
    averageScore
  };
};
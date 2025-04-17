import { Golfer } from '../../types/golf.js';
import { MetricWeight } from '../../types/metrics.js';
import { simulateMultipleRounds } from './simulateRound.js';
import { calculateImpliedProbability } from './calculateScores.js';

export const simulateGolfers = (golfers: Golfer[], weights: MetricWeight[], roundRange: number = 12): Golfer[] => {
  // Use 200 rounds for a balance of accuracy and performance
  const numRounds = 200;
  
  const simulatedGolfers = golfers.map(golfer => {
    const competitors = golfers.filter(g => g.id !== golfer.id);
    const { averageFinish, winPercentage, top10Percentage } = simulateMultipleRounds(
      golfer,
      weights,
      numRounds,
      competitors//,
      //roundRange
    );
    
    // Calculate implied probability from odds
    const impliedProbability = golfer.odds?.impliedProbability || 
                             (golfer.odds?.fanduel ? calculateImpliedProbability(golfer.odds.fanduel) : 0);
    
    return {
      ...golfer,
      simulatedRank: averageFinish,
      impliedProbability, // Store for sorting
      simulationStats: {
        ...golfer.simulationStats,
        averageFinish,
        winPercentage,
        top10Percentage,
        impliedProbability // Add to simulation stats for reference
      }
    };
  });

  // First try to sort by win percentage
  // If win percentages are low or identical, fall back to sorting by implied probability
  const sortedGolfers = simulatedGolfers.sort((a, b) => {
    const aWinPct = a.simulationStats?.winPercentage || 0;
    const bWinPct = b.simulationStats?.winPercentage || 0;
    
    // If both have no wins or very low win percentages, use implied probability
    if (aWinPct < 0.5 && bWinPct < 0.5) {
      return (b.impliedProbability || 0) - (a.impliedProbability || 0);
    }
    
    // Otherwise use win percentage
    return bWinPct - aWinPct;
  });
  
  return sortedGolfers;
};
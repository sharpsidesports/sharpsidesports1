import { Golfer } from '../../types/golf';
import { MetricWeight } from '../../types/metrics';
import { calculateSimulatedScore } from './calculateScores';
import { generateRandomFactor } from '../random';

export const simulateRound = (golfer: Golfer, weights: MetricWeight[], allGolfers: Golfer[] = []) => {
  return calculateSimulatedScore(golfer, weights, generateRandomFactor(), allGolfers);
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

  // Create a full list of golfers including the current golfer
  const allGolfers = [golfer, ...competitors];

  let totalPosition = 0;
  let wins = 0;
  let top10Finishes = 0;
  let top25Finishes = 0;
  let totalScore = 0;

  // Calculate field size for percentage-based thresholds
  const fieldSize = competitors.length + 1; // +1 for the current golfer
  const top10Threshold = Math.ceil(fieldSize * 0.1);
  const top25Threshold = Math.ceil(fieldSize * 0.25);
  
  // Optimization: Calculate base scores once rather than on every iteration
  // This is a major performance improvement when number of rounds is large
  const allGolferBaseScores = new Map();
  
  allGolfers.forEach(g => {
    // Base score calculation (without random component)
    const baseScore = calculateSimulatedScore(g, weights, 0, allGolfers);
    allGolferBaseScores.set(g.id, baseScore);
  });
  
  // Run the simulation for each round
  for (let i = 0; i < numRounds; i++) {
    const roundScores = [];
    
    // Generate scores for this round
    for (const g of allGolfers) {
      // Get the pre-calculated base score
      const baseScore = allGolferBaseScores.get(g.id);
      
      // Add random component
      const randomFactor = generateRandomFactor();
      
      // Calculate the final score with randomness
      // Allow more randomness for all players to ensure upsets can happen
      // Get implied probability to scale randomness
      const impliedProb = g.odds?.impliedProbability || 
                        (g.odds?.fanduel ? calculateImpliedProbability(g.odds.fanduel) : 0);
      
      // Top players (high implied probability) get more moderate randomness
      // Lower players get higher randomness
      // This ensures favorites can still lose sometimes
      const probabilityFactor = impliedProb > 0 ? impliedProb : 0.01;
      
      // Higher minimum variance ensures upsets can happen
      // Scale is reduced for top players but still allows for some bad rounds
      const randomVariance = 0.4 + (1 - probabilityFactor) * 0.6;
      
      const finalScore = baseScore * (1 + randomFactor * randomVariance);
      
      roundScores.push({
        id: g.id,
        score: finalScore
      });
    }
    
    // Sort scores for this round (lower is better)
    roundScores.sort((a, b) => a.score - b.score);
    
    // Find our golfer's position (1-indexed)
    const position = roundScores.findIndex(s => s.id === golfer.id) + 1;
    totalPosition += position;
    
    // Record the score for average calculation
    const golferScore = roundScores.find(s => s.id === golfer.id)?.score || 0;
    totalScore += golferScore;
    
    // Track stats
    if (position === 1) wins++;
    if (position <= top10Threshold) top10Finishes++;
    if (position <= top25Threshold) top25Finishes++;
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
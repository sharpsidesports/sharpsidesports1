export interface CourseConditions {
  grass: 'all' | 'bermuda' | 'bentgrass' | 'other';
  wind: 'all' | 'calm' | 'breezy' | 'windy';
  course: 'all' | 'pete-dye' | 'donald-ross' | 'other';
  speed: 'all' | 'slow' | 'moderate' | 'fast';
  driving: 'easy' | 'medium' | 'hard';
  approach: 'easy' | 'medium' | 'hard';
  scoring: 'easy' | 'medium' | 'hard';
}

export interface Golfer {
  id: string;
  name: string;
  imageUrl: string;
  rank: number;
  strokesGainedTotal: number;
  strokesGainedTee: number;
  strokesGainedApproach: number;
  strokesGainedAround: number;
  strokesGainedPutting: number;
  drivingAccuracy: number;
  drivingDistance: number;
  proximityMetrics: {
    '100-125': number;
    '125-150': number;
    '175-200': number;
    '200-225': number;
    '225plus': number;
  };
  scoringStats?: {
    bogeyAvoidance?: number;
    consecutiveBirdiesStreak?: number;
    consecutiveBirdiesEaglesStreak?: number;
    totalEagles?: number;
    totalBirdies?: number;
    par3BirdieOrBetter?: number;
    par4BirdieOrBetter?: number;
    par5BirdieOrBetter?: number;
    birdieOrBetterConversion?: number;
    par3ScoringAvg?: number;
    par4ScoringAvg?: number;
    par5ScoringAvg?: number;
    eaglesPerHole?: number;
    birdieAverage?: number;
    birdieOrBetterPercentage?: number;
    consecutiveHolesBelowPar?: number;
  };
  odds: number;
  simulatedRank: number;
  simulationStats: {
    averageFinish: number;
    winPercentage: number;
    impliedProbability: number;
  };
  recentRounds: RoundResult[];
}

export interface CourseResult {
  year: number;
  position: number;
  score: number;
}

export interface RoundResult {
  date: string;
  position: number;
  score: number;
  strokes: number;
}

// // export interface SimulationWeights {
// //   offTheTee: number;
// //   approach: number;
// //   aroundGreen: number;
// //   putting: number;
// //   proximity100125: number;
// //   proximity125150: number;
// //   proximity175200: number;
// //   proximity200225: number;
// //   proximity225plus: number;
// // }

// export interface GolferData {
//   id: string;
//   name: string;
//   rank: number;
//   imageUrl: string;
//   strokesGainedTotal: number;
//   strokesGainedTee: number;
//   strokesGainedApproach: number;
//   strokesGainedAround: number;
//   strokesGainedPutting: number;
//   proximityMetrics: {
//     '100-125': number;
//     '125-150': number;
//     '175-200': number;
//     '200-225': number;
//     '225plus': number;
//   };
//   odds: number;
//   simulatedRank: number;
//   simulationStats: {
//     averageFinish: number;
//     winPercentage: number;
//     impliedProbability: number;
//   };
//   recentRounds: RoundResult[];
// }

// export interface GolferStats {
//   player_name: string;
//   stats: {
//     sg_total: number;
//     sg_ott: number;
//     sg_app: number;
//     sg_arg: number;
//     sg_putt: number;
//     prox_100_125: number;
//     prox_125_150: number;
//     prox_175_200: number;
//     prox_200_225: number;
//     prox_225_plus: number;
//   };
// }
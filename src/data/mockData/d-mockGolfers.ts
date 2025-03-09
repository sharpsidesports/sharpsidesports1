// import { Golfer } from '../../types/golf';
// import { calculateImpliedProbability } from '../../utils/calculations/oddsCalculator';

// import { RoundResult } from '../../types/golf';

// const generateMockHistoricalData = (basePosition: number, variance: number = 5): RoundResult[] => {
//   return Array.from({ length: 36 }, (_, i) => ({
//     date: new Date(2024, 0, i + 1).toISOString(),
//     position: Math.max(1, Math.round(basePosition + (Math.random() * variance * 2 - variance))),
//     score: -(Math.round(Math.random() * 10) + 65),
//     strokes: Math.round(Math.random() * 5) + 68
//   }));
// };

// export const mockGolfers: Golfer[] = [
//   {
//     id: "1",
//     name: "Scottie Scheffler",
//     imageUrl: "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_46046.png",
//     rank: 1,
//     strokesGainedTotal: 2.8,
//     strokesGainedTee: 0.8,
//     strokesGainedApproach: 1.2,
//     strokesGainedAround: 0.4,
//     strokesGainedPutting: 0.4,
//     odds: +600,
//     salary: 11000,
//     courseHistory: [
//       { year: 2023, position: 1, score: -15 },
//       { year: 2022, position: 3, score: -12 },
//       { year: 2021, position: 5, score: -10 }
//     ],
//     simulatedRank: 0,
//     proximityMetrics: {
//       '100-125': 17.2,
//       '125-150': 19.8,
//       '175-200': 27.5,
//       '200-225': 35.2,
//       '225plus': 45.8
//     },
//     simulationStats: {
//       averageFinish: 0,
//       winPercentage: 0,
//       impliedProbability: calculateImpliedProbability(600)
//     },
//     recentRounds: generateMockHistoricalData(3)
//   },
//   {
//     id: "4",
//     name: "Viktor Hovland",
//     imageUrl: "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_46717.png",
//     rank: 4,
//     strokesGainedTotal: 2.3,
//     strokesGainedTee: 0.6,
//     strokesGainedApproach: 1.0,
//     strokesGainedAround: 0.3,
//     strokesGainedPutting: 0.4,
//     odds: +1200,
//     courseHistory: [
//       { year: 2023, position: 3, score: -13 },
//       { year: 2022, position: 5, score: -10 },
//       { year: 2021, position: 6, score: -9 }
//     ],
//     simulatedRank: 0,
//     proximityMetrics: {
//       '100-125': 17.8,
//       '125-150': 20.2,
//       '175-200': 28.5,
//       '200-225': 36.8,
//       '225plus': 47.2
//     },
//     simulationStats: {
//       averageFinish: 0,
//       winPercentage: 0,
//       impliedProbability: calculateImpliedProbability(1200)
//     },
//     recentRounds: generateMockHistoricalData(6)
//   },
//   {
//     id: "5",
//     name: "Patrick Cantlay",
//     imageUrl: "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_39971.png",
//     rank: 5,
//     strokesGainedTotal: 2.2,
//     strokesGainedTee: 0.5,
//     strokesGainedApproach: 0.8,
//     strokesGainedAround: 0.5,
//     strokesGainedPutting: 0.4,
//     odds: +1400,
//     courseHistory: [
//       { year: 2023, position: 5, score: -11 },
//       { year: 2022, position: 4, score: -11 },
//       { year: 2021, position: 3, score: -12 }
//     ],
//     simulatedRank: 0,
//     proximityMetrics: {
//       '100-125': 17.6,
//       '125-150': 20.5,
//       '175-200': 28.8,
//       '200-225': 36.2,
//       '225plus': 46.8
//     },
//     simulationStats: {
//       averageFinish: 0,
//       winPercentage: 0,
//       impliedProbability: calculateImpliedProbability(1400)
//     },
//     recentRounds: generateMockHistoricalData(7)
//   },
//   {
//     id: "6",
//     name: "Xander Schauffele",
//     imageUrl: "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_48081.png",
//     rank: 6,
//     strokesGainedTotal: 2.1,
//     strokesGainedTee: 0.6,
//     strokesGainedApproach: 0.7,
//     strokesGainedAround: 0.4,
//     strokesGainedPutting: 0.4,
//     odds: +1600,
//     courseHistory: [
//       { year: 2023, position: 6, score: -10 },
//       { year: 2022, position: 7, score: -9 },
//       { year: 2021, position: 8, score: -8 }
//     ],
//     simulatedRank: 0,
//     proximityMetrics: {
//       '100-125': 17.9,
//       '125-150': 20.8,
//       '175-200': 29.1,
//       '200-225': 37.1,
//       '225plus': 47.5
//     },
//     simulationStats: {
//       averageFinish: 0,
//       winPercentage: 0,
//       impliedProbability: calculateImpliedProbability(1600)
//     },
//     recentRounds: generateMockHistoricalData(8)
//   },
//   {
//     id: "7",
//     name: "Brooks Koepka",
//     imageUrl: "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_34046.png",
//     rank: 7,
//     strokesGainedTotal: 2.0,
//     strokesGainedTee: 0.7,
//     strokesGainedApproach: 0.6,
//     strokesGainedAround: 0.3,
//     strokesGainedPutting: 0.4,
//     odds: +1800,
//     courseHistory: [
//       { year: 2023, position: 7, score: -9 },
//       { year: 2022, position: 6, score: -10 },
//       { year: 2021, position: 7, score: -9 }
//     ],
//     simulatedRank: 0,
//     proximityMetrics: {
//       '100-125': 18.1,
//       '125-150': 21.0,
//       '175-200': 29.4,
//       '200-225': 37.4,
//       '225plus': 47.8
//     },
//     simulationStats: {
//       averageFinish: 0,
//       winPercentage: 0,
//       impliedProbability: calculateImpliedProbability(1800)
//     },
//     recentRounds: generateMockHistoricalData(9)
//   },
//   {
//     id: "8",
//     name: "Jordan Spieth",
//     imageUrl: "https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,f_auto,g_face:center,h_294,q_auto,w_220/headshots_34046.png",
//     rank: 8,
//     strokesGainedTotal: 1.9,
//     strokesGainedTee: 0.4,
//     strokesGainedApproach: 0.7,
//     strokesGainedAround: 0.4,
//     strokesGainedPutting: 0.4,
//     odds: +2000,
//     courseHistory: [
//       { year: 2023, position: 8, score: -8 },
//       { year: 2022, position: 9, score: -7 },
//       { year: 2021, position: 10, score: -6 }
//     ],
//     simulatedRank: 0,
//     proximityMetrics: {
//       '100-125': 18.3,
//       '125-150': 21.2,
//       '175-200': 29.7,
//       '200-225': 37.7,
//       '225plus': 48.1
//     },
//     simulationStats: {
//       averageFinish: 0,
//       winPercentage: 0,
//       impliedProbability: calculateImpliedProbability(2000)
//     },
//     recentRounds: generateMockHistoricalData(10)
//   }
// ].map(golfer => ({
//   ...golfer,
//   salary: golfer.salary || Math.floor(Math.random() * (12000 - 6000) + 6000) * 100
// }));
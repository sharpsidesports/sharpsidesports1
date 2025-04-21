import { StateCreator } from 'zustand';
import { MetricWeight } from '../../types/metrics.js';

const DEFAULT_METRICS: MetricWeight[] = [
  // Core metrics - Total 100%
  { metric: 'Total', weight: 20 },
  { metric: 'OTT', weight: 20 },
  { metric: 'APP', weight: 20 },
  { metric: 'ARG', weight: 20 },
  { metric: 'P', weight: 20 },
  
  // // Course fit metrics - Total 20%
  // { metric: 'DrivingDist', weight: 8 },
  // { metric: 'DrivingAcc', weight: 6 },
  // { metric: 'gir', weight: 6 },
  
  // // Scoring metrics - Total 35%
  // { metric: 'BogeyAvoid', weight: 10 },
  // { metric: 'BirdieConversion', weight: 10 },
  // { metric: 'Par3Scoring', weight: 5 },
  // { metric: 'Par4Scoring', weight: 5 },
  // { metric: 'Par5Scoring', weight: 5 }
];

export interface SimulationSlice {
  weights: MetricWeight[];
  roundRange: number;
  simulationRounds: number;
  updateWeights: (weights: MetricWeight[]) => void;
  setRoundRange: (range: number) => void;
  setSimulationRounds: (rounds: number) => void;
}

export const createSimulationSlice: StateCreator<SimulationSlice> = (set) => ({
  weights: DEFAULT_METRICS,
  roundRange: 12,
  simulationRounds: 1000,
  
  updateWeights: (weights) => set({ weights }),
  setRoundRange: (range) => set({ roundRange: range }),
  setSimulationRounds: (rounds) => set({ simulationRounds: rounds })
});
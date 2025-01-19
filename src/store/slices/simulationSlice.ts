import { StateCreator } from 'zustand';
import { MetricWeight } from '../../types/metrics';

const DEFAULT_METRICS: MetricWeight[] = [
  // Core metrics
  { metric: 'OTT', weight: 15 },
  { metric: 'P', weight: 15 },
  { metric: 'T2G', weight: 10 },
  { metric: 'DrivingDist', weight: 5 },
  
  // Proximity metrics
  { metric: 'Prox100_125', weight: 5 },
  { metric: 'Prox125_150', weight: 5 },
  
  // Scoring metrics
  { metric: 'BogeyAvoid', weight: 10 },
  { metric: 'BirdieConversion', weight: 10 },
  { metric: 'Par3Scoring', weight: 5 },
  // { metric: 'Par4Scoring', weight: 10 },
  // { metric: 'Par5Scoring', weight: 5 },
  // { metric: 'BirdieOrBetterPct', weight: 5 }
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
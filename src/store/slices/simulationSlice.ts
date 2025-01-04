import { StateCreator } from 'zustand';
import { MetricWeight } from '../../types/metrics';

const DEFAULT_METRICS: MetricWeight[] = [
  { metric: 'OTT', weight: 20 },
  { metric: 'APP', weight: 20 },
  { metric: 'ARG', weight: 20 },
  { metric: 'P', weight: 20 },
  { metric: 'T2G', weight: 20 }
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
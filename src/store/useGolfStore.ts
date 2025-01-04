import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createGolfersSlice, GolfersSlice } from './slices/golfersSlice';
import { createSimulationSlice, SimulationSlice } from './slices/simulationSlice';
import { createConditionsSlice, ConditionsSlice } from './slices/conditionsSlice';
import { createAnalyticalModelsSlice, AnalyticalModelsState } from './slices/analyticalModelsSlice';
import { simulateGolfers } from '../utils/simulation/simulateGolfers';

export type GolfStore = GolfersSlice & SimulationSlice & ConditionsSlice & AnalyticalModelsState & {
  runSimulation: () => void;
};

export const useGolfStore = create<GolfStore>()(
  persist(
    (set, get, ...a) => ({
      ...createGolfersSlice(set, get, ...a),
      ...createSimulationSlice(set, get, ...a),
      ...createConditionsSlice(set, get, ...a),
      ...createAnalyticalModelsSlice(set, get, ...a),
      runSimulation: () => {
        console.log('Simulating results in useGolfStore');
        const { golfers, weights, selectedCourses } = get();
        const simulatedGolfers = simulateGolfers(golfers, weights, selectedCourses);
        set({ golfers: simulatedGolfers });
      },
    }),
    {
      name: 'golf-store',
      partialize: (state) => ({
        savedModels: state.savedModels,
      }),
    }
  )
);
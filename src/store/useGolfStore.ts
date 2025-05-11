import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createGolfersSlice, GolfersSlice } from './slices/golfersSlice.js';
import { createSimulationSlice, SimulationSlice } from './slices/simulationSlice.js';
import { createConditionsSlice, ConditionsSlice } from './slices/conditionsSlice.js';
import { createAnalyticalModelsSlice, AnalyticalModelsState } from './slices/analyticalModelsSlice.js';
import { createFantasySlice, FantasySlice } from './slices/fantasySlice.js';
import { simulateGolfers } from '../utils/simulation/simulateGolfers.js';

export type GolfStore = GolfersSlice & SimulationSlice & ConditionsSlice & AnalyticalModelsState & FantasySlice & {
  runSimulation: () => void;
};

export const useGolfStore = create<GolfStore>()(
  persist(
    (set, get, ...a) => ({
      ...createGolfersSlice(set, get, ...a),
      ...createSimulationSlice(set, get, ...a),
      ...createConditionsSlice(set, get, ...a),
      ...createAnalyticalModelsSlice(set, get, ...a),
      ...createFantasySlice(set, get, ...a),
      runSimulation: () => {
        console.log('Simulating results in useGolfStore');
        const { golfers, weights, roundRange } = get();
        // Filter each golfer's rounds to the most recent N (roundRange) and recalculate stats
        const filteredGolfers = golfers.map(golfer => {
          // Gather all rounds across all courses
          const allRounds = Object.values(golfer.recentRounds || {})
            .flatMap(course => course.rounds)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const recentRounds = allRounds.slice(0, roundRange);

          type Round = typeof allRounds[number];
          const avg = (key: keyof Round) => recentRounds.length ? recentRounds.reduce((sum, r) => sum + (typeof r[key] === 'number' ? (r[key] as number) : 0), 0) / recentRounds.length : 0;

          // Proximity metrics
          const proxAvg = (key: keyof Round) => recentRounds.length ? recentRounds.reduce((sum, r) => sum + (typeof r[key] === 'number' ? (r[key] as number) : 0), 0) / recentRounds.length : 0;

          return {
            ...golfer,
            strokesGainedTotal: avg('sg_total'),
            strokesGainedTee: avg('sg_ott'),
            strokesGainedApproach: avg('sg_app'),
            strokesGainedAround: avg('sg_arg'),
            strokesGainedPutting: avg('sg_putt'),
            gir: avg('gir'),
            drivingAccuracy: avg('driving_acc'),
            drivingDistance: avg('driving_dist'),
            proximityMetrics: {
              '100-125': proxAvg('prox_fw'),
              '125-150': proxAvg('prox_rgh'),
              '150-175': proxAvg('prox_fw'),
              '175-200': proxAvg('prox_rgh'),
              '200-225': proxAvg('prox_fw'),
              '225plus': proxAvg('prox_rgh'),
            },
            // scoringStats and other metrics can be recalculated similarly if needed
          };
        });
        const simulatedGolfers = simulateGolfers(filteredGolfers, weights, roundRange);
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
import { create } from 'zustand';
import type {
  CourseFilterState,
  DifficultyFilterState
} from '../types/golf.js';

export interface Golfer {
  id: string;
  name: string;
  worldRanking: number;
  imageUrl: string;
  salary?: number;
  projectedPoints?: number;
  stats: {
    drivingDistance: number;
    drivingAccuracy: number;
    greensInRegulation: number;
    puttingAverage: number;
    scoringAverage: number;
  };
}

interface GolfStore {
  golfers: Golfer[];
  loading: boolean;
  error: string | null;

  courseFilters: CourseFilterState;
  difficultyFilters: DifficultyFilterState;
  updateCourseFilters: (patch: Partial<CourseFilterState>) => void;
  updateDifficultyFilters: (patch: Partial<DifficultyFilterState>) => void;

  fetchGolfers: () => Promise<void>;
}

export const useGolfStore = create<GolfStore>((set) => ({
  golfers: [],
  loading: false,
  error: null,
  courseFilters: {
    grass: 'all',
    course: 'all',
  },
  difficultyFilters: {
    driving: ['easy', 'medium', 'hard'],
    approach: ['easy', 'medium', 'hard'],
    scoring: ['easy', 'medium', 'hard'],
  },
  updateCourseFilters: (patch) =>
    set((state) => ({
      courseFilters: { ...state.courseFilters, ...patch },
    })),
  updateDifficultyFilters: (patch) =>
    set((state) => ({
      difficultyFilters: { ...state.difficultyFilters, ...patch },
    })),

  fetchGolfers: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call to fetch golfers
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockGolfers: Golfer[] = [
        {
          id: '1',
          name: 'Rory McIlroy',
          worldRanking: 1,
          imageUrl: 'https://example.com/rory.jpg',
          stats: {
            drivingDistance: 312.4,
            drivingAccuracy: 58.2,
            greensInRegulation: 68.5,
            puttingAverage: 1.72,
            scoringAverage: 69.8,
          },
        },
        {
          id: '2',
          name: 'Jon Rahm',
          worldRanking: 2,
          imageUrl: 'https://example.com/rahm.jpg',
          stats: {
            drivingDistance: 308.7,
            drivingAccuracy: 62.1,
            greensInRegulation: 70.2,
            puttingAverage: 1.68,
            scoringAverage: 69.5,
          },
        },
        {
          id: '3',
          name: 'Scottie Scheffler',
          worldRanking: 3,
          imageUrl: 'https://example.com/scheffler.jpg',
          stats: {
            drivingDistance: 310.2,
            drivingAccuracy: 60.8,
            greensInRegulation: 69.8,
            puttingAverage: 1.71,
            scoringAverage: 69.6,
          },
        },
      ];

      set({ golfers: mockGolfers, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch golfers',
        loading: false,
      });
    }
  },
})); 
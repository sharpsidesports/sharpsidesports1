/*import { StateCreator } from 'zustand';
import { Golfer } from '../../types/golf.js';
import { mockGolfers } from '../../data/mockData/mockGolfers.js';

export interface GolfersSlice {
  golfers: Golfer[];
  loading: boolean;
  error: string | null;
  setGolfersMock: (golfers: Golfer[]) => void;
  fetchGolferDataMock: () => void;
}

export const createGolfersSlice: StateCreator<GolfersSlice> = (set, get) => ({
  golfers: mockGolfers,
  loading: false,
  error: null,
  
  setGolfersMock: (golfers) => set({ golfers }),
  
  fetchGolferDataMock: () => {
    set({ 
      golfers: mockGolfers,
      loading: false,
      error: null
    });
  }
});*/
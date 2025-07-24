import { StateCreator } from 'zustand';
import { Golfer } from '../../types/golf.js';
import { datagolfService } from '../../services/api/datagolfService.js';
import { transformGolferData } from '../../utils/transformers/golferTransformer.js';
import { useGolfStore } from '../useGolfStore.js';
import { loadScoringStats } from '../../utils/data/scoringStatsLoader.js';

export interface GolfersSlice {
  golfers: Golfer[];
  loading: boolean;
  error: string | null;
  setGolfers: (golfers: Golfer[]) => void;
  fetchGolferData: () => Promise<void>;
}

export const createGolfersSlice: StateCreator<GolfersSlice> = (set) => ({
  golfers: [],
  loading: false,
  error: null,

  setGolfers: (golfers) => {
    if (!Array.isArray(golfers)) {
      console.warn('Attempted to set non-array golfers:', golfers);
      set({ golfers: [], error: 'Invalid golfers data format' });
      return;
    }
    set({ golfers });
  },

  fetchGolferData: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch real Data Golf data
      const [rankingsResponse, oddsResponse, approachStatsResponse, scoringStats] = await Promise.all([
        datagolfService.getPlayerRankings(),
        datagolfService.getBettingOdds(),
        datagolfService.getApproachStats(),
        loadScoringStats()
      ]);

      // Transform the data using the existing transformer
      const enrichedData = await transformGolferData(
        rankingsResponse.rankings || [],
        oddsResponse.odds || [],
        approachStatsResponse.data || [],
        [], // selected courses - empty for now
        scoringStats
      );

      set({ golfers: enrichedData, error: null, loading: false });
    } catch (err) {
      console.error('Error fetching golfer data:', err);
      set({ error: 'Failed to load golfer data', loading: false });
    }
  }
});
import { StateCreator } from 'zustand';
import { Golfer } from '../../types/golf';
import { datagolfService } from '../../services/api/datagolfService';
import { transformGolferData } from '../../utils/transformers/golferTransformer';
import { useGolfStore } from '../useGolfStore';
import { loadScoringStats } from '../../utils/data/scoringStatsLoader';

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
      // Fetch data from DataGolf API
      const [rankingsResponse, oddsResponse, approachResponse] = await Promise.all([
        datagolfService.getPlayerRankings(),
        datagolfService.getBettingOdds(),
        datagolfService.getApproachStats(),
      ]);

      if (!rankingsResponse?.rankings || !Array.isArray(rankingsResponse.rankings)) {
        throw new Error('Invalid rankings data received');
      }

      const { selectedCourses } = useGolfStore.getState();
      const scoringStats = loadScoringStats();

      const enrichedData = await transformGolferData(
        rankingsResponse.rankings,
        oddsResponse?.odds || [],
        approachResponse?.data || [],
        selectedCourses,
        scoringStats
      );

      if (!Array.isArray(enrichedData)) {
        throw new Error('Transformed data is not an array');
      }

      set({ golfers: enrichedData, error: null });
    } catch (err) {
      console.error('Failed to fetch or transform data:', err);
      set({ 
        golfers: [], 
        error: err instanceof Error ? err.message : 'Failed to fetch live data'
      });
    } finally {
      set({ loading: false });
    }
  }
});
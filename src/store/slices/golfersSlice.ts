import { StateCreator } from 'zustand';
import { Golfer, ApproachStat } from '../../types/golf.js';
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
      // Fetch data from DataGolf API
      const [rankingsResponse, oddsResponse, approachResponse] = await Promise.all([
        datagolfService.getPlayerRankings(),
        datagolfService.getBettingOdds(),
        datagolfService.getApproachStats(),
      ]);

      console.log('API Responses:', {
        rankings: rankingsResponse?.rankings?.length || 0,
        odds: oddsResponse?.odds?.length || 0,
        approach: approachResponse?.data?.length || 0
      });

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
      console.log('Fetched and transformed data:', enrichedData);

      set({ golfers: enrichedData, error: null });
    } catch (err) {
      console.error('Error in fetchGolferData:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to fetch golfer data', loading: false });
    } finally {
      set({ loading: false });
    }
  }
});
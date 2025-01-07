import { StateCreator } from 'zustand';
import { Golfer } from '../../types/golf';
import { datagolfService } from '../../services/api/datagolfService';
import { transformGolferData } from '../../utils/transformers/golferTransformer';
import { useGolfStore } from '../useGolfStore';

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

  setGolfers: (golfers) => set({ golfers }),

  fetchGolferData: async () => {
    set({ loading: true, error: null });
    try {
      const [rankingsResponse,  oddsResponse, approachResponse] = await Promise.all([
        datagolfService.getPlayerRankings(),
        datagolfService.getBettingOdds(),
        datagolfService.getApproachStats()
      ]);

      const { selectedCourses } = useGolfStore.getState();

      const enrichedData = transformGolferData(
        rankingsResponse.rankings,
        oddsResponse.odds,
        approachResponse.data,
        selectedCourses
      );

      set({ golfers: enrichedData });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      set({ error: 'Failed to fetch live data' });
    } finally {
      set({ loading: false });
    }
  }
});
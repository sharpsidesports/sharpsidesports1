import { StateCreator } from 'zustand';
import { datagolfService } from '../../services/api/datagolfService';
import { DFSEventData, FantasyPlayer, DFSSite } from '../../types/fantasy';
import { Golfer } from '../../types/golf';

export interface FantasySlice {
  dfsEventData?: DFSEventData;
  fantasyPlayers: FantasyPlayer[];
  loading: boolean;
  error: string | null;
  fetchDFSProjections: (site: DFSSite) => Promise<void>;
  updateFantasyPlayers: (golfers: Golfer[]) => void;
}

export const createFantasySlice: StateCreator<FantasySlice> = (set, get) => ({
  fantasyPlayers: [],
  loading: false,
  error: null,

  fetchDFSProjections: async (site: DFSSite) => {
    set({ loading: true, error: null });
    try {
      const data = await datagolfService.getDFSProjections({
        tour: 'pga',
        site
      });
      
      set({ dfsEventData: data });
      
      // Convert projections to fantasy players and sort by ownership
      const fantasyPlayers = data.projections
        .map(proj => ({
          id: proj.dg_id.toString(),
          name: proj.player_name,
          salary: proj.salary,
          projectedPoints: proj.proj_points_total,
          position: 'G',
          ownership: proj.proj_ownership / 100
        }))
        .sort((a, b) => b.ownership - a.ownership)  // Sort by ownership descending
        // .slice(0, 20);  // Take top 20
      
      set({ fantasyPlayers });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch DFS projections' });
    } finally {
      set({ loading: false });
    }
  },

  updateFantasyPlayers: (golfers) => {
    const { fantasyPlayers } = get();
    const updatedPlayers = fantasyPlayers.map(player => {
      const golfer = golfers.find(g => g.name === player.name);
      if (golfer) {
        return {
          ...player,
          id: golfer.id
        };
      }
      return player;
    });
    set({ fantasyPlayers: updatedPlayers });
  }
});

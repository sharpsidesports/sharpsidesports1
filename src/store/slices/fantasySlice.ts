import { StateCreator } from 'zustand';
import { datagolfService } from '../../services/api/datagolfService.js';
import { DFSEventData, FantasyPlayer, DFSSite } from '../../types/fantasy.js';
import { Golfer } from '../../types/golf.js';

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
      const response = await datagolfService.getDFSProjections(site);
      
      if (response && response.data) {
        const fantasyPlayers: FantasyPlayer[] = response.data.map((player: any) => ({
          id: player.dg_id?.toString() || player.id?.toString() || '',
          name: player.player_name || player.name || '',
          salary: player.salary || 0,
          projected_points: player.projected_points || 0,
          position: player.position || 'G',
          team: player.team || '',
          odds: player.odds || 0,
          approach_stats: player.approach_stats || {
            avg_approach_distance: 0,
            avg_approach_accuracy: 0
          },
          selected_courses: player.selected_courses || []
        }));

        set({ 
          fantasyPlayers, 
          dfsEventData: response.event_data || {},
          loading: false 
        });
      } else {
        set({ loading: false, error: 'No DFS data available' });
      }
    } catch (error) {
      console.error('Error fetching DFS projections:', error);
      set({ loading: false, error: 'Failed to fetch DFS projections' });
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

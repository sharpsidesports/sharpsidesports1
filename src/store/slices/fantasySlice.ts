import { StateCreator } from 'zustand';
import { datagolfService } from '../../services/api/datagolfService';
import { DFSEvent, DFSEventData, FantasyPlayer } from '../../types/fantasy';
import { Golfer } from '../../types/golf';

export interface FantasySlice {
  dfsEvents: DFSEvent[];
  currentEvent?: DFSEvent;
  dfsEventData?: DFSEventData;
  fantasyPlayers: FantasyPlayer[];
  loading: boolean;
  error: string | null;
  fetchDFSEvents: () => Promise<void>;
  setCurrentEvent: (event: DFSEvent) => void;
  fetchDFSEventData: (event: DFSEvent) => Promise<void>;
  updateFantasyPlayers: (golfers: Golfer[]) => void;
}

export const createFantasySlice: StateCreator<FantasySlice> = (set, get) => ({
  dfsEvents: [],
  fantasyPlayers: [],
  loading: false,
  error: null,

  fetchDFSEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await datagolfService.getDFSEventList();
      if (!Array.isArray(events)) {
        throw new Error('Invalid events data received');
      }
      // Sort events by date descending to get the latest first
      const sortedEvents = events.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      set({ dfsEvents: sortedEvents });
      
      // Automatically set the most recent event as current if no event is selected
      if (sortedEvents.length > 0 && !get().currentEvent) {
        const latestEvent = sortedEvents[0];
        set({ currentEvent: latestEvent });
        // Fetch data for the latest event
        await get().fetchDFSEventData(latestEvent);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch DFS events' });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentEvent: (event) => {
    set({ currentEvent: event });
  },

  fetchDFSEventData: async (event) => {
    set({ loading: true, error: null });
    try {
      const data = await datagolfService.getDFSEventData({
        tour: event.tour as any, // TODO: Add proper type validation
        event_id: event.event_id,
        year: event.calendar_year
      });
      set({ dfsEventData: data });
      
      // Update fantasy players if we have golfers
      const { golfers } = get() as any; // Access golfers from root store
      if (golfers?.length > 0) {
        get().updateFantasyPlayers(golfers);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch DFS event data' });
    } finally {
      set({ loading: false });
    }
  },

  updateFantasyPlayers: (golfers) => {
    const { dfsEventData } = get();
    
    // Only update if we have DFS data
    if (!dfsEventData?.dfs_points) {
      console.warn('No DFS data available for updating fantasy players');
      return;
    }

    const fantasyPlayers = golfers.map(golfer => {
      // Find matching DFS data by player name
      const dfsData = dfsEventData.dfs_points.find(
        dp => dp.player_name.toLowerCase() === golfer.name.toLowerCase()
      );

      return {
        id: golfer.id,
        name: golfer.name,
        salary: dfsData?.salary ?? 0,
        projectedPoints: golfer.projectedPoints ?? 0,
        position: 'G', // Golf only has one position
        ownership: dfsData?.ownership ?? 0,
        actualPoints: dfsData?.total_pts ?? 0,
        dfsEventId: dfsEventData.event_id ? parseInt(dfsEventData.event_id) : undefined
      };
    });

    set({ fantasyPlayers });
  }
});

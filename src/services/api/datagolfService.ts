// DataGolf API service - fetches real data from the API proxy
export const datagolfService = {
  getPlayerRankings: async () => {
    try {
      const response = await fetch('/api/datagolf/rankings');
      if (!response.ok) throw new Error('Failed to fetch rankings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching player rankings:', error);
      return { rankings: [] };
    }
  },

  getSkillRatings: async () => {
    try {
      const response = await fetch('/api/datagolf/skill-ratings');
      if (!response.ok) throw new Error('Failed to fetch skill ratings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching skill ratings:', error);
      return {};
    }
  },

  getBettingOdds: async () => {
    try {
      const response = await fetch('/api/datagolf/betting-odds');
      if (!response.ok) throw new Error('Failed to fetch betting odds');
      return await response.json();
    } catch (error) {
      console.error('Error fetching betting odds:', error);
      return {};
    }
  },

  getApproachStats: async () => {
    try {
      const response = await fetch('/api/datagolf/approach-stats');
      if (!response.ok) throw new Error('Failed to fetch approach stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching approach stats:', error);
      return { data: [] };
    }
  },

  getEventList: async () => {
    try {
      const response = await fetch('/api/datagolf/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  getRoundScoring: async () => {
    try {
      const response = await fetch('/api/datagolf/round-scoring');
      if (!response.ok) throw new Error('Failed to fetch round scoring');
      return await response.json();
    } catch (error) {
      console.error('Error fetching round scoring:', error);
      return {};
    }
  },

  getThreeBallOdds: async () => {
    try {
      const response = await fetch('/api/datagolf/three-ball-odds');
      if (!response.ok) throw new Error('Failed to fetch three ball odds');
      return await response.json();
    } catch (error) {
      console.error('Error fetching three ball odds:', error);
      return [];
    }
  },

  getMatchups: async () => {
    try {
      const response = await fetch('/api/datagolf/matchups');
      if (!response.ok) throw new Error('Failed to fetch matchups');
      return await response.json();
    } catch (error) {
      console.error('Error fetching matchups:', error);
      return [];
    }
  },

  getDFSProjections: async (site: string = 'draftkings') => {
    try {
      const response = await fetch(`/api/datagolf/dfs-projections?site=${site}`);
      if (!response.ok) throw new Error('Failed to fetch DFS projections');
      return await response.json();
    } catch (error) {
      console.error('Error fetching DFS projections:', error);
      return {};
    }
  }
};

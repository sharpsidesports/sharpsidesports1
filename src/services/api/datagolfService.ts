import { apiClient } from './apiClient.js';
import { ENDPOINTS } from './endpoints.js';
import { DFSEventData, DFSSite, DFSTour } from '../../types/fantasy.js';

// This interface is used to define the structure of the response from the DataGolf API for betting odds.

/*interface BettingOddsResponse {
  event_name: string;
  last_updated: string;
  market: string;
  odds: Array<{
    player_name: string;
    fanduel?: number;
    datagolf?: {
      baseline?: number;
      baseline_history_fit?: number;
    };
  }>;
}*/

// This interface is used to define the structure of the response from the DataGolf API for player rankings.

export interface RankingsResponse {
  event_name: string;
  last_updated: string;
  market: string;
  rankings: Array<{
    dg_id: string;
    datagolf_rank: number;
    player_name: string;
    fanduel?: number;
    datagolf?: {
      baseline?: number;
      baseline_history_fit?: number;
    };
  }>;
}

export const datagolfService = {
  async getPlayerRankings(): Promise<RankingsResponse> {
    try {
      const response = await apiClient.get<RankingsResponse>(ENDPOINTS.RANKINGS);
      return response;
    } catch (error) {
      console.error('Error fetching player rankings:', error);
      throw error;
    }
  },

  async getSkillRatings() {
    try {
      const response = await apiClient.get(ENDPOINTS.SKILL_RATINGS, {
        display: 'value'
      });
      return response;
    } catch (error) {
      console.error('Error fetching skill ratings:', error);
      throw error;
    }
  },

  async getBettingOdds() {
    try {
      const response = await apiClient.get<{
        event_name: string;
        last_updated: string;
        market: string;
        odds: Array<{
          player_name: string;
          dg_id: string;
          fanduel?: number;
        }>;
      }>(ENDPOINTS.OUTRIGHTS, {
        tour: 'pga',
        market: 'win',
        odds_format: 'american'
      });

      console.log('Betting odds response:', {
        eventName: response?.event_name,
        lastUpdated: response?.last_updated,
        oddsCount: response?.odds?.length || 0,
        sampleOdds: response?.odds?.[0]
      });

      return response;
    } catch (error) {
      console.error('Error fetching betting odds:', error);
      throw error;
    }
  },

  async getApproachStats() {
    try {
      const response = await apiClient.get(ENDPOINTS.APPROACH_SKILL, {
        period: 'l12'
      });
      return response;
    } catch (error) {
      console.error('Error fetching approach stats:', error);
      throw error;
    }
  },
  async getEventList() {
    try {
      const response = await apiClient.get(ENDPOINTS.EVENT_LIST, {
        file_format: 'json'
      });
      return response;
    } catch (error) {
      console.error('Error fetching event list:', error);
      throw error;
    }
  },

  async getRoundScoring(tour, eventId, year) {
    try {
      const response = await apiClient.get(ENDPOINTS.HISTORICAL_ROUNDS, {
        tour,
        event_id: eventId,
        year,
        file_format: 'json'
      });
      return response;
    } catch (error) {
      console.error('Error fetching round scoring:', error);
      throw error;
    }
  },

  async getThreeBallOdds() {
    try {
      const response = await apiClient.get(ENDPOINTS.MATCHUPS, {
        tour: 'pga',
        market: '3_balls',
        odds_format: 'american'
      });
      return response;
    } catch (error) {
      console.error('Error fetching three ball odds:', error);
      throw error;
    }
  },

  async getMatchups() {
    try {
      const response = await apiClient.get(ENDPOINTS.MATCHUPS, {
        tour: 'pga',
        market: 'round_matchups',
        odds_format: 'american',
        file_format: 'json'
      });
      return response;
    } catch (error) {
      console.error('Error fetching matchups:', error);
      throw error;
    }
  },

  async getDFSProjections(params: {
    tour: DFSTour;
    site: DFSSite;
  }): Promise<DFSEventData> {
    try {
      const response = await apiClient.get(ENDPOINTS.FANTASY_PROJECTIONS, {
        tour: params.tour,
        site: params.site,
        slate: 'main',
        file_format: 'json'
      });
      return response;
    } catch (error) {
      console.error('Error fetching DFS projections:', error);
      throw error;
    }
  }
};

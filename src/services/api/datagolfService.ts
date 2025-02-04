import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { GolferData, GolferStats } from '../../types/golf';
import { DFSEvent, DFSEventData, DFSSite, DFSTour } from '../../types/fantasy';

export const datagolfService = {
  async getPlayerRankings() {
    try {
      const response = await apiClient.get(ENDPOINTS.RANKINGS);
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
      const response = await apiClient.get(ENDPOINTS.BETTING_ODDS, {
        tour: 'pga',
        market: 'win',
        odds_format: 'american'
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
        odds_format: 'american'
      });
      return response;
    } catch (error) {
      console.error('Error fetching matchups:', error);
      throw error;
    }
  },

  async getDFSEventList() {
    try {
      const response = await apiClient.get<DFSEvent[]>(ENDPOINTS.DFS_EVENT_LIST, {
        file_format: 'json'
      });
      return response;
    } catch (error) {
      console.error('Error fetching DFS event list:', error);
      throw error;
    }
  },

  async getDFSEventData(params: {
    tour: DFSTour;
    site?: DFSSite;
    event_id: number | string;
    year: number;
  }) {
    try {
      const { tour, site = 'draftkings', event_id, year } = params;
      const response = await apiClient.get<DFSEventData>(ENDPOINTS.DFS_POINTS, {
        tour,
        site,
        event_id,
        year,
        file_format: 'json'
      });
      return response;
    } catch (error) {
      console.error('Error fetching DFS event data:', error);
      throw error;
    }
  }
};

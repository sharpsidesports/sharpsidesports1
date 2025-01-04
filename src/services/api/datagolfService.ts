import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { GolferData, GolferStats } from '../../types/golf';

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
  }


};


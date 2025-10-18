import axios from 'axios';

const AI_API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: AI_API_URL,
  timeout: 30000, // AI queries might take longer
});

export const aiAPI = {
  processQuery: async (query: string) => {
    try {
      const response = await api.post('/query', {
        query: query,
      });
      return response.data.response;
    } catch (error) {
      console.error('Error processing AI query:', error);
      throw error;
    }
  },

  getPlayerAnalysis: async (playerId: string, season: string, type: string) => {
    try {
      const response = await api.post('/analyze-player', {
        player_id: playerId,
        season: season,
        type: type,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting player analysis:', error);
      throw error;
    }
  },

  comparePlayers: async (playerIds: string[], season: string) => {
    try {
      const response = await api.post('/compare-players', {
        player_ids: playerIds,
        season: season,
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing players:', error);
      throw error;
    }
  },
};

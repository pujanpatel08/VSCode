import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const nbaAPI = {
  searchPlayers: async (query: string) => {
    try {
      const response = await api.get(`/players/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  },

  getPlayerStats: async (playerId: string, season: string, type: 'regular' | 'playoffs') => {
    try {
      const response = await api.get(`/players/${playerId}/stats?season=${season}&type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error getting player stats:', error);
      throw error;
    }
  },

  getPlayerInfo: async (playerId: string) => {
    try {
      const response = await api.get(`/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting player info:', error);
      throw error;
    }
  },

  getTeams: async () => {
    try {
      const response = await api.get('/teams');
      return response.data;
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  },
};

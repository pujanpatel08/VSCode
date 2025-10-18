const axios = require('axios');

const NBA_API_BASE = 'https://api-nba-v1.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

if (!RAPIDAPI_KEY) {
  console.warn('RAPIDAPI_KEY not found in environment variables');
}

const api = axios.create({
  baseURL: NBA_API_BASE,
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
  },
  timeout: 10000,
});

class NBAService {
  async searchPlayers(query) {
    try {
      const response = await api.get('/players', {
        params: {
          search: query,
        },
      });
      
      return response.data.response.map(player => ({
        id: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        team: player.team ? {
          id: player.team.id,
          name: player.team.name,
          code: player.team.code,
        } : null,
        position: player.leagues?.standard?.pos,
        height: player.height,
        weight: player.weight,
        birth: player.birth,
      }));
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }

  async getPlayerById(id) {
    try {
      const response = await api.get(`/players/${id}`);
      const player = response.data.response[0];
      
      if (!player) {
        return null;
      }
      
      return {
        id: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        team: player.team ? {
          id: player.team.id,
          name: player.team.name,
          code: player.team.code,
        } : null,
        position: player.leagues?.standard?.pos,
        height: player.height,
        weight: player.weight,
        birth: player.birth,
      };
    } catch (error) {
      console.error('Error getting player:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId, season, type = 'regular') {
    try {
      const response = await api.get(`/players/statistics`, {
        params: {
          id: playerId,
          season: season,
          type: type,
        },
      });
      
      const stats = response.data.response;
      
      if (!stats || stats.length === 0) {
        return null;
      }
      
      // Calculate averages
      const totals = stats.reduce((acc, game) => {
        acc.points += game.points || 0;
        acc.totReb += game.totReb || 0;
        acc.assists += game.assists || 0;
        acc.steals += game.steals || 0;
        acc.blocks += game.blocks || 0;
        acc.fgm += game.fgm || 0;
        acc.fga += game.fga || 0;
        acc.tpm += game.tpm || 0;
        acc.tpa += game.tpa || 0;
        acc.ftm += game.ftm || 0;
        acc.fta += game.fta || 0;
        acc.turnovers += game.turnovers || 0;
        return acc;
      }, {
        points: 0, totReb: 0, assists: 0, steals: 0, blocks: 0,
        fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0, turnovers: 0
      });
      
      const gameCount = stats.length;
      
      return {
        points: totals.points / gameCount,
        totReb: totals.totReb / gameCount,
        assists: totals.assists / gameCount,
        steals: totals.steals / gameCount,
        blocks: totals.blocks / gameCount,
        fgm: totals.fgm / gameCount,
        fga: totals.fga / gameCount,
        fgp: totals.fga > 0 ? (totals.fgm / totals.fga) * 100 : 0,
        tpm: totals.tpm / gameCount,
        tpa: totals.tpa / gameCount,
        tpp: totals.tpa > 0 ? (totals.tpm / totals.tpa) * 100 : 0,
        ftm: totals.ftm / gameCount,
        fta: totals.fta / gameCount,
        ftp: totals.fta > 0 ? (totals.ftm / totals.fta) * 100 : 0,
        turnovers: totals.turnovers / gameCount,
        games: stats.slice(0, 10).map(game => ({
          id: game.game.id,
          date: game.game.date,
          points: game.points || 0,
          totReb: game.totReb || 0,
          assists: game.assists || 0,
          steals: game.steals || 0,
          blocks: game.blocks || 0,
          fgm: game.fgm || 0,
          fga: game.fga || 0,
          tpm: game.tpm || 0,
          tpa: game.tpa || 0,
          ftm: game.ftm || 0,
          fta: game.fta || 0,
          turnovers: game.turnovers || 0,
          team: game.team,
          opponent: game.team,
        })),
      };
    } catch (error) {
      console.error('Error getting player stats:', error);
      throw error;
    }
  }

  async getPlayerGames(playerId, season, type = 'regular', page = 1, limit = 25) {
    try {
      const response = await api.get(`/players/statistics`, {
        params: {
          id: playerId,
          season: season,
          type: type,
        },
      });
      
      const games = response.data.response;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        games: games.slice(startIndex, endIndex),
        total: games.length,
        page,
        limit,
        totalPages: Math.ceil(games.length / limit),
      };
    } catch (error) {
      console.error('Error getting player games:', error);
      throw error;
    }
  }

  async getAllTeams() {
    try {
      const response = await api.get('/teams');
      
      return response.data.response.map(team => ({
        id: team.id,
        name: team.name,
        code: team.code,
        city: team.city,
        logo: team.logo,
      }));
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  }

  async getTeamById(id) {
    try {
      const response = await api.get(`/teams/${id}`);
      const team = response.data.response[0];
      
      if (!team) {
        return null;
      }
      
      return {
        id: team.id,
        name: team.name,
        code: team.code,
        city: team.city,
        logo: team.logo,
      };
    } catch (error) {
      console.error('Error getting team:', error);
      throw error;
    }
  }

  async getTeamRoster(teamId, season) {
    try {
      const response = await api.get('/players', {
        params: {
          team: teamId,
          season: season,
        },
      });
      
      return response.data.response.map(player => ({
        id: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        position: player.leagues?.standard?.pos,
        height: player.height,
        weight: player.weight,
      }));
    } catch (error) {
      console.error('Error getting team roster:', error);
      throw error;
    }
  }

  async getTeamStats(teamId, season, type = 'regular') {
    try {
      const response = await api.get('/teams/statistics', {
        params: {
          id: teamId,
          season: season,
          type: type,
        },
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Error getting team stats:', error);
      throw error;
    }
  }

  async getLeagueLeaders(season, type = 'regular', category = 'points') {
    try {
      const response = await api.get('/players/statistics', {
        params: {
          season: season,
          type: type,
        },
      });
      
      const stats = response.data.response;
      
      // Group by player and calculate totals
      const playerStats = {};
      stats.forEach(stat => {
        const playerId = stat.player.id;
        if (!playerStats[playerId]) {
          playerStats[playerId] = {
            player: stat.player,
            games: 0,
            points: 0,
            totReb: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            fgm: 0,
            fga: 0,
            tpm: 0,
            tpa: 0,
            ftm: 0,
            fta: 0,
            turnovers: 0,
          };
        }
        
        playerStats[playerId].games += 1;
        playerStats[playerId].points += stat.points || 0;
        playerStats[playerId].totReb += stat.totReb || 0;
        playerStats[playerId].assists += stat.assists || 0;
        playerStats[playerId].steals += stat.steals || 0;
        playerStats[playerId].blocks += stat.blocks || 0;
        playerStats[playerId].fgm += stat.fgm || 0;
        playerStats[playerId].fga += stat.fga || 0;
        playerStats[playerId].tpm += stat.tpm || 0;
        playerStats[playerId].tpa += stat.tpa || 0;
        playerStats[playerId].ftm += stat.ftm || 0;
        playerStats[playerId].fta += stat.fta || 0;
        playerStats[playerId].turnovers += stat.turnovers || 0;
      });
      
      // Calculate averages and sort
      const leaders = Object.values(playerStats)
        .map(player => ({
          ...player,
          [category]: player[category] / player.games,
        }))
        .sort((a, b) => b[category] - a[category])
        .slice(0, 10);
      
      return leaders;
    } catch (error) {
      console.error('Error getting league leaders:', error);
      throw error;
    }
  }

  async getStandings(season, type = 'regular') {
    try {
      const response = await api.get('/standings', {
        params: {
          season: season,
          type: type,
        },
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Error getting standings:', error);
      throw error;
    }
  }

  async getSchedule(season, date, team) {
    try {
      const params = { season };
      if (date) params.date = date;
      if (team) params.team = team;
      
      const response = await api.get('/games', { params });
      
      return response.data.response;
    } catch (error) {
      console.error('Error getting schedule:', error);
      throw error;
    }
  }

  async getGameById(id) {
    try {
      const response = await api.get(`/games/${id}`);
      const game = response.data.response[0];
      
      if (!game) {
        return null;
      }
      
      return game;
    } catch (error) {
      console.error('Error getting game:', error);
      throw error;
    }
  }
}

module.exports = new NBAService();

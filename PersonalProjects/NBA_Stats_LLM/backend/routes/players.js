const express = require('express');
const router = express.Router();
const nbaService = require('../services/nbaService');

// Search players by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const players = await nbaService.searchPlayers(q);
    res.json(players);
  } catch (error) {
    console.error('Error searching players:', error);
    res.status(500).json({ error: 'Failed to search players' });
  }
});

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const player = await nbaService.getPlayerById(id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ error: 'Failed to get player' });
  }
});

// Get player stats
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { season, type = 'regular' } = req.query;
    
    if (!season) {
      return res.status(400).json({ error: 'Season parameter is required' });
    }

    const stats = await nbaService.getPlayerStats(id, season, type);
    res.json(stats);
  } catch (error) {
    console.error('Error getting player stats:', error);
    res.status(500).json({ error: 'Failed to get player stats' });
  }
});

// Get player game log
router.get('/:id/games', async (req, res) => {
  try {
    const { id } = req.params;
    const { season, type = 'regular', page = 1, limit = 25 } = req.query;
    
    if (!season) {
      return res.status(400).json({ error: 'Season parameter is required' });
    }

    const games = await nbaService.getPlayerGames(id, season, type, page, limit);
    res.json(games);
  } catch (error) {
    console.error('Error getting player games:', error);
    res.status(500).json({ error: 'Failed to get player games' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const nbaService = require('../services/nbaService');

// Get league leaders
router.get('/leaders', async (req, res) => {
  try {
    const { season, type = 'regular', category = 'points' } = req.query;
    
    if (!season) {
      return res.status(400).json({ error: 'Season parameter is required' });
    }

    const leaders = await nbaService.getLeagueLeaders(season, type, category);
    res.json(leaders);
  } catch (error) {
    console.error('Error getting league leaders:', error);
    res.status(500).json({ error: 'Failed to get league leaders' });
  }
});

// Get season standings
router.get('/standings', async (req, res) => {
  try {
    const { season, type = 'regular' } = req.query;
    
    if (!season) {
      return res.status(400).json({ error: 'Season parameter is required' });
    }

    const standings = await nbaService.getStandings(season, type);
    res.json(standings);
  } catch (error) {
    console.error('Error getting standings:', error);
    res.status(500).json({ error: 'Failed to get standings' });
  }
});

// Get game schedule
router.get('/schedule', async (req, res) => {
  try {
    const { season, date, team } = req.query;
    
    const schedule = await nbaService.getSchedule(season, date, team);
    res.json(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Failed to get schedule' });
  }
});

// Get game details
router.get('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await nbaService.getGameById(id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ error: 'Failed to get game' });
  }
});

module.exports = router;

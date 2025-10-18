const express = require('express');
const router = express.Router();
const nbaService = require('../services/nbaService');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await nbaService.getAllTeams();
    res.json(teams);
  } catch (error) {
    console.error('Error getting teams:', error);
    res.status(500).json({ error: 'Failed to get teams' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await nbaService.getTeamById(id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    console.error('Error getting team:', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
});

// Get team roster
router.get('/:id/roster', async (req, res) => {
  try {
    const { id } = req.params;
    const { season } = req.query;
    
    const roster = await nbaService.getTeamRoster(id, season);
    res.json(roster);
  } catch (error) {
    console.error('Error getting team roster:', error);
    res.status(500).json({ error: 'Failed to get team roster' });
  }
});

// Get team stats
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { season, type = 'regular' } = req.query;
    
    if (!season) {
      return res.status(400).json({ error: 'Season parameter is required' });
    }

    const stats = await nbaService.getTeamStats(id, season, type);
    res.json(stats);
  } catch (error) {
    console.error('Error getting team stats:', error);
    res.status(500).json({ error: 'Failed to get team stats' });
  }
});

module.exports = router;

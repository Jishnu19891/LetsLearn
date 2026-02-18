const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Helper: get or create the singleton score document
async function getScore() {
    let score = await Score.findOne();
    if (!score) {
        score = await Score.create({ xp: 0 });
    }
    return score;
}

// GET /api/score
router.get('/', async (req, res) => {
    try {
        const score = await getScore();
        res.json({ xp: score.xp });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get score' });
    }
});

// POST /api/score/add  — adds 10 XP
router.post('/add', async (req, res) => {
    try {
        const score = await getScore();
        score.xp += 10;
        await score.save();
        res.json({ xp: score.xp });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update score' });
    }
});

// DELETE /api/score/reset
router.delete('/reset', async (req, res) => {
    try {
        const score = await getScore();
        score.xp = 0;
        await score.save();
        res.json({ xp: 0 });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reset score' });
    }
});

module.exports = router;

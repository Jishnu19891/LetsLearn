const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions/:category
router.get('/:category', async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

module.exports = router;

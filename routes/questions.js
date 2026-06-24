const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Category = require('../models/Category');

// GET /api/questions/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/questions/:category
router.get('/:category', async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category });
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

module.exports = router;

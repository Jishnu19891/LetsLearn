const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Question = require('../models/Question');

// ── Categories ────────────────────────────────────────────────

// GET /api/admin/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST /api/admin/categories  { key, label }
router.post('/categories', async (req, res) => {
    try {
        const { key, label } = req.body;
        if (!key || !label) return res.status(400).json({ error: 'key and label are required' });
        const category = await Category.create({ key: key.toLowerCase().trim(), label: label.trim() });
        res.status(201).json(category);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Subject key already exists' });
        console.error(err);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// DELETE /api/admin/categories/:key  (also deletes all questions in that category)
router.delete('/categories/:key', async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ key: req.params.key });
        if (!deleted) return res.status(404).json({ error: 'Category not found' });
        await Question.deleteMany({ category: req.params.key });
        res.json({ message: 'Category and its questions deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// ── Questions ─────────────────────────────────────────────────

// GET /api/admin/questions?category=html
router.get('/questions', async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const questions = await Question.find(filter);
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// POST /api/admin/questions  { category, title, lesson, question, answer }
router.post('/questions', async (req, res) => {
    try {
        const { category, title, lesson, question, answer } = req.body;
        if (!category || !title || !lesson || !question || !answer)
            return res.status(400).json({ error: 'All fields are required' });
        const q = await Question.create({ category, title, lesson, question, answer });
        res.status(201).json(q);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create question' });
    }
});

// DELETE /api/admin/questions/:id
router.delete('/questions/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid question ID' });
        const deleted = await Question.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

module.exports = router;

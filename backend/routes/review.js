const express = require('express');
const OllamaClient = require('../ollama-client');
const { getConnection } = require('../database');

const router = express.Router();
const ollama = new OllamaClient();

// Submit code for review
router.post('/', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Code snippet and language are required' 
      });
    }

    // Generate AI review
    const reviewResult = await ollama.generateReview(code, language);

    // Save to database
    const connection = getConnection();
    const [result] = await connection.execute(
      'INSERT INTO reviews (code_snippet, language, review_result, rating) VALUES (?, ?, ?, ?)',
      [code, language, reviewResult.review, reviewResult.rating]
    );

    res.json({
      id: result.insertId,
      review: reviewResult.review,
      rating: reviewResult.rating,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to generate review' });
  }
});

// Get review history
router.get('/history', async (req, res) => {
  try {
    const connection = getConnection();
    const [reviews] = await connection.execute(
      'SELECT * FROM reviews ORDER BY created_at DESC LIMIT 20'
    );

    res.json(reviews);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch review history' });
  }
});

// Get specific review
router.get('/:id', async (req, res) => {
  try {
    const connection = getConnection();
    const [reviews] = await connection.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [req.params.id]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(reviews[0]);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

module.exports = router;
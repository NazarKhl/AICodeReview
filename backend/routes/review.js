// routes/review.js
const express = require('express');
const OllamaClient = require('../ollama-client');
const { getConnection } = require('../database');

const router = express.Router();
const ollama = new OllamaClient();

// POST /api/review
router.post('/', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code snippet and language are required' });
    }

    const reviewResult = await ollama.generateReview(code, language);

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

// GET /api/review/history
router.get('/history', async (req, res) => {
  try {
    const connection = getConnection();
    const [reviews] = await connection.execute(
      'SELECT * FROM reviews ORDER BY created_at DESC LIMIT 50'
    );
    res.json(reviews);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch review history' });
  }
});

// GET /api/review/:id
router.get('/:id', async (req, res) => {
  try {
    const connection = getConnection();
    const [reviews] = await connection.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [req.params.id]
    );
    if (reviews.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json(reviews[0]);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// PUT /api/review/:id
router.put('/:id', async (req, res) => {
  try {
    const { language } = req.body;
    if (!language) return res.status(400).json({ error: 'Language/title is required' });

    const connection = getConnection();
    const [result] = await connection.execute(
      'UPDATE reviews SET language = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [language, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Review not found' });

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/review/:id
router.delete('/:id', async (req, res) => {
  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      'DELETE FROM reviews WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;

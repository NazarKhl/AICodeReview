require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reviewRoutes = require('./routes/review');
const { connectDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/review', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Code Review Assistant is running' });
});

// Initialize database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
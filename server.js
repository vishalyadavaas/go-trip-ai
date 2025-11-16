const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/cors');
// Add to backend/server.js
const hotelRoutes = require('./routes/hotel.routes');
const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/drips', require('./routes/trips'));
app.use('/api/distance', require('./routes/distance'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/ai', require('./routes/ai'));
// Add these lines with your other routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Travel Super App API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      places: '/api/places',
      trips: '/api/trips',
      weather: '/api/weather',
      distance: '/api/distance',
      transport: '/api/transport',
      ai: '/api/ai'
    },
    documentation: 'Add your API documentation link here'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception thrown:', err);
  process.exit(1);
});

module.exports = app;
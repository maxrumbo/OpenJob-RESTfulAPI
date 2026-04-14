const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// API routes
app.use(routes);

// Root endpoint
app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Welcome to OpenJob RESTful API v1',
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  return res.status(404).json({
    status: 'failed',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

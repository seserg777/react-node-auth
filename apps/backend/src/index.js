// Main server file
const path = require('path');
require('module-alias').addAliases({
  '@config': path.resolve(__dirname, 'config'),
  '@controllers': path.resolve(__dirname, 'controllers'),
  '@routes': path.resolve(__dirname, 'routes'),
  '@models': path.resolve(__dirname, 'models'),
  '@middleware': path.resolve(__dirname, 'middleware'),
  '@utils': path.resolve(__dirname, 'utils')
});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { testConnection } = require('@config/database');
const { syncDatabase } = require('@models');
const authRoutes = require('@routes/auth');
const productRoutes = require('@routes/products');
const healthController = require('@controllers/healthController');
const { errorHandler } = require('@middleware/errorHandler');
const config = require('../config');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
// General API limiter (exclude static assets by applying only to /api)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600, // higher bucket for general API
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints (credential stuffing protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for product endpoints (more generous for browsing)
const productsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP (allows browsing/pagination)
  message: 'Too many product requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productsLimiter, productRoutes);

// Health check endpoint
app.get('/api/health', healthController.getHealth);

// Centralized error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database (create tables if they don't exist)
    await syncDatabase();
    
    // Start listening
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/api/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

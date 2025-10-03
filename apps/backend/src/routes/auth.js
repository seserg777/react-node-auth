// Authentication routes
const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail().escape(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name').optional().isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters').escape()
], (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  authController.register(req, res);
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail().escape(),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  authController.login(req, res);
});

// Update user profile endpoint
router.put('/profile', [
  authenticateToken,
  body('name').optional().isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters').escape(),
  body('email').optional().isEmail().normalizeEmail().escape()
], (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  authController.updateProfile(req, res);
});

// Delete user profile endpoint
router.delete('/profile', [
  authenticateToken
], (req, res) => {
  authController.deleteProfile(req, res);
});

// Get user profile endpoint
router.get('/profile', [
  authenticateToken
], (req, res) => {
  authController.getProfile(req, res);
});

module.exports = router;
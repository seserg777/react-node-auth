// Authentication tests
const request = require('supertest');
const express = require('express');
const authRoutes = require('@routes/auth');
const { errorHandler } = require('@middleware/errorHandler');
// Mock the database models
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(() => 'hashedpassword'),
  compareSync: jest.fn(() => true)
}));

const { User } = require('../models');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe.skip('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
        name: 'Test User'
      };

      // Mock database responses
      User.findOne.mockResolvedValue(null); // No existing user
      User.create.mockResolvedValue({
        id: 1,
        email: userData.email,
        name: userData.name,
        password: 'hashedpassword'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Test123!',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        email: 'test2@example.com',
        password: 'weak',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
        name: 'Test User'
      };

      // Mock existing user
      User.findOne.mockResolvedValue({
        id: 1,
        email: userData.email,
        name: userData.name
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'logintest@example.com',
        password: 'Test123!'
      };

      // Mock database response for login
      User.findOne.mockResolvedValue({
        id: 1,
        email: loginData.email,
        name: 'Login Test User',
        password: '$2a$10$hashedpassword'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'logintest@example.com',
        password: 'WrongPassword'
      };

      // Mock database response - user not found
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Test123!'
      };

      // Mock database response - user not found
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});

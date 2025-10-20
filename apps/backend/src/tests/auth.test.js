// Authentication tests
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');

// Mock the database models BEFORE any other imports
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

const { User } = require('../models');
const authRoutes = require('@routes/auth');
const { errorHandler } = require('@middleware/errorHandler');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Authentication API', () => {
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
      
      // Mock User.create to return a user object with hashed password
      User.create.mockImplementation(async (data) => {
        return {
          id: 1,
          email: data.email,
          name: data.name,
          password: data.password, // Already hashed by controller
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(User.create).toHaveBeenCalled();
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

      // Hash the password to simulate real database entry
      const hashedPassword = bcrypt.hashSync(loginData.password, 10);

      // Mock database response for login
      User.findOne.mockResolvedValue({
        id: 1,
        email: loginData.email,
        name: 'Login Test User',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
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

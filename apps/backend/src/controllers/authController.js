// Authentication controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../../config');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = await User.create({
        email,
        password: hashedPassword,
        name: name || null
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: '30m' }
      );

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      res.status(201).json({
        message: 'User registered successfully',
        token: token,
        user: userData
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: '30m' }
      );

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      res.json({
        message: 'Login successful',
        token: token,
        user: userData
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const userId = req.user.userId;

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await User.findOne({ 
          where: { 
            email,
            id: { [require('sequelize').Op.ne]: userId }
          }
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Email is already taken' });
        }
      }

      // Build update data
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      // Update user
      const [affectedRows] = await User.update(updateData, {
        where: { id: userId }
      });

      if (affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get updated user data
      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'name']
      });

      res.json({
        message: 'Profile updated successfully',
        user: user
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete user profile
  async deleteProfile(req, res) {
    try {
      const userId = req.user.userId;

      const deletedRows = await User.destroy({
        where: { id: userId }
      });

      if (deletedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Profile deleted successfully' });

    } catch (error) {
      console.error('Profile deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'name', 'created_at']
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile retrieved successfully',
        user: user
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();

// Models index file
const { sequelize } = require('../config/database');
const User = require('./User');

// Initialize all models
const models = {
  User
};

// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use alter: true for development
    console.log('Sequelize: Database synchronized successfully');
  } catch (error) {
    console.error('Sequelize: Database synchronization failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  models,
  syncDatabase,
  User
};

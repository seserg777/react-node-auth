// Models index file
const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');

// Initialize all models
const models = {
  User,
  Product
};

// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
  try {
    await sequelize.sync();
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
  User,
  Product
};

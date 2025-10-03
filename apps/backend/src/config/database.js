// Sequelize database configuration
const { Sequelize } = require('sequelize');
const config = require('../../config');

// Create Sequelize instance
const sequelize = new Sequelize({
  database: config.database.database,
  username: config.database.user,
  password: config.database.password,
  host: config.database.host,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize: Database connection established successfully');
  } catch (error) {
    console.error('Sequelize: Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection
};

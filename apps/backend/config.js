// Database and server configuration
module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: '30m', // 30 minutes
  database: {
    host: process.env.DB_HOST || 'mysql-5.7.local',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reactnode'
  }
};

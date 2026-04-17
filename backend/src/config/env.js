// Environment configuration
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/user_management_system',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

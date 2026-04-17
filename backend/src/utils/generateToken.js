const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateAccessToken = (userId, role) => {
  const payload = {
    userId,
    role,
    type: 'access'
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  const payload = {
    userId,
    type: 'refresh'
  };

  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpire
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {object} Decoded token payload
 */
const verifyToken = (token, type = 'access') => {
  try {
    const secret = type === 'refresh' ? config.jwtRefreshSecret : config.jwtSecret;
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error(`Invalid or expired ${type} token`);
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};

const bcrypt = require('bcryptjs');

/**
 * Hash a plain password
 * @param {string} password - Plain password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword - Plain password from user
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};

const User = require('../models/user.model');
const { comparePassword } = require('../utils/hashPassword');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: 'user',
      status: 'active'
    });

    await newUser.save();
    return newUser.toJSON();
  }

  /**
   * Login user with email and password
   */
  async loginUser(email, password) {
    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // Check if user is active
    if (user.status === 'inactive') {
      const error = new Error('Your account is inactive. Contact administrator.');
      error.status = 403;
      throw error;
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    return {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  /**
   * Verify and refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    const { verifyToken } = require('../utils/generateToken');

    try {
      const decoded = verifyToken(refreshToken, 'refresh');

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || user.isDeleted) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user._id.toString(), user.role);

      return {
        accessToken: newAccessToken,
        refreshToken // Return the same refresh token
      };
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
}

module.exports = new AuthService();

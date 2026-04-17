const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const { generateTokens } = require('../utils/jwt');
const {
  isValidEmail,
  isValidPassword,
  isValidName,
  sanitizeInput,
} = require('../utils/validators');

class AuthService {
  async register(userData) {
    const { name, email, password, passwordConfirm } = userData;

    // Validate input
    if (!isValidName(name)) {
      throw new AppError('Please provide a valid name (2-100 characters)', 400);
    }

    if (!isValidEmail(email)) {
      throw new AppError('Please provide a valid email', 400);
    }

    if (!isValidPassword(password)) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    if (password !== passwordConfirm) {
      throw new AppError('Passwords do not match', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email is already in use', 400);
    }

    // Create user
    const user = await User.create({
      name: sanitizeInput(name),
      email: email.toLowerCase(),
      password,
      role: 'User', // Default role for new registrations
      status: 'active',
    });

    // Generate tokens
    const tokens = generateTokens(user._id.toString(), user.role);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  async login(email, password) {
    // Validate input
    if (!isValidEmail(email)) {
      throw new AppError('Please provide a valid email', 400);
    }

    if (!password) {
      throw new AppError('Please provide a password', 400);
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (user.status === 'inactive') {
      throw new AppError('This account has been deactivated', 403);
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = generateTokens(user._id.toString(), user.role);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  async refreshTokens(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.status === 'inactive') {
      throw new AppError('This account has been deactivated', 403);
    }

    const tokens = generateTokens(user._id.toString(), user.role);

    return tokens;
  }

  async changePassword(userId, currentPassword, newPassword, passwordConfirm) {
    // Validate input
    if (!isValidPassword(newPassword)) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    if (newPassword !== passwordConfirm) {
      throw new AppError('Passwords do not match', 400);
    }

    // Find user with password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    user.updatedBy = userId;
    await user.save();

    return { success: true, message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();

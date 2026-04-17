const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidRole,
  isValidStatus,
  sanitizeInput,
} = require('../utils/validators');

class UserService {
  async getAllUsers(filters = {}, page = 1, limit = 10) {
    const { role, status, search } = filters;

    // Build query
    const query = {};

    if (role) {
      if (!isValidRole(role)) {
        throw new AppError('Invalid role', 400);
      }
      query.role = role;
    }

    if (status) {
      if (!isValidStatus(status)) {
        throw new AppError('Invalid status', 400);
      }
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async createUser(userData, createdBy) {
    const { name, email, password, role, status } = userData;

    // Validate input
    if (!isValidName(name)) {
      throw new AppError('Please provide a valid name (2-100 characters)', 400);
    }

    if (!isValidEmail(email)) {
      throw new AppError('Please provide a valid email', 400);
    }

    // Auto-generate password if not provided
    let userPassword = password;
    if (!userPassword) {
      userPassword = this.generatePassword();
    } else if (!isValidPassword(userPassword)) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    if (role && !isValidRole(role)) {
      throw new AppError('Invalid role', 400);
    }

    if (status && !isValidStatus(status)) {
      throw new AppError('Invalid status', 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      throw new AppError('Email is already in use', 400);
    }

    // Create user
    const user = await User.create({
      name: sanitizeInput(name),
      email: email.toLowerCase(),
      password: userPassword,
      role: role || 'User',
      status: status || 'active',
      createdBy,
    });

    return user;
  }

  async updateUser(userId, updates, updatedBy) {
    const { name, email, role, status } = updates;
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validate updates
    if (name !== undefined) {
      if (!isValidName(name)) {
        throw new AppError('Please provide a valid name (2-100 characters)', 400);
      }
      user.name = sanitizeInput(name);
    }

    if (email !== undefined) {
      if (!isValidEmail(email)) {
        throw new AppError('Please provide a valid email', 400);
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new AppError('Email is already in use', 400);
      }

      user.email = email.toLowerCase();
    }

    if (role !== undefined) {
      if (!isValidRole(role)) {
        throw new AppError('Invalid role', 400);
      }
      user.role = role;
    }

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        throw new AppError('Invalid status', 400);
      }
      user.status = status;
    }

    user.updatedBy = updatedBy;
    await user.save();

    return user;
  }

  async deleteUser(userId, deletedBy) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Soft delete by marking as inactive
    user.status = 'inactive';
    user.updatedBy = deletedBy;
    await user.save();

    return { success: true, message: 'User has been deactivated' };
  }

  async hardDeleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return { success: true, message: 'User has been permanently deleted' };
  }

  generatePassword() {
    // Generate a random password
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async getUserStats() {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      byRole: stats,
    };
  }
}

module.exports = new UserService();

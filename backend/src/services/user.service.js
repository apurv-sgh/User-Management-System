const User = require('../models/user.model');

class UserService {
  /**
   * Get all users with pagination and search
   */
  async getAllUsers(filters = {}, page = 1, limit = 10) {
    const { search, role, status } = filters;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isDeleted: false };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated results
    const users = await User.find(query)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId)
      .where('isDeleted').equals(false)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  }

  /**
   * Create a new user (Admin only)
   */
  async createUser(userData, createdByUserId) {
    const { email, password, firstName, lastName, role, status } = userData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.status = 400;
      throw error;
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'user',
      status: status || 'active',
      createdBy: createdByUserId
    });

    await newUser.save();
    return newUser.toJSON();
  }

  /**
   * Update user (Admin/Manager)
   */
  async updateUser(userId, updateData, updatedByUserId, userRole) {
    const user = await User.findById(userId).where('isDeleted').equals(false);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // Managers cannot update admins
    if (userRole === 'manager' && user.role === 'admin') {
      const error = new Error('Managers cannot update admin users');
      error.status = 403;
      throw error;
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'email', 'status'];
    if (userRole === 'admin') {
      allowedFields.push('role');
    }

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    user.updatedBy = updatedByUserId;
    await user.save();

    return user.toJSON();
  }

  /**
   * Delete user (soft delete - Admin only)
   */
  async deleteUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (user.role === 'admin') {
      const error = new Error('Cannot delete admin users');
      error.status = 403;
      throw error;
    }

    // Soft delete
    user.isDeleted = true;
    await user.save();

    return { message: 'User deleted successfully' };
  }

  /**
   * Update user's own profile
   */
  async updateProfile(userId, updateData) {
    const user = await User.findById(userId).where('isDeleted').equals(false);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // Users can only update firstName and lastName
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;

    user.updatedBy = userId;
    await user.save();

    return user.toJSON();
  }

  /**
   * Get user profile (own)
   */
  async getProfile(userId) {
    const user = await User.findById(userId)
      .where('isDeleted').equals(false)
      .select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  }

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const { comparePassword } = require('../utils/hashPassword');
    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.status = 401;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}

module.exports = new UserService();

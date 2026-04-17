const userService = require('../services/user.service');

class UserController {
  /**
   * Get all users (Admin/Manager)
   * GET /api/users
   */
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, search, role, status } = req.query;

      const result = await userService.getAllUsers(
        { search, role, status },
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user (Admin only)
   * POST /api/users
   */
  async createUser(req, res, next) {
    try {
      const { email, password, firstName, lastName, role, status } = req.body;

      const user = await userService.createUser(
        { email, password, firstName, lastName, role, status },
        req.user.userId
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user (Admin/Manager)
   * PUT /api/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (soft delete - Admin only)
   * DELETE /api/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's own profile
   * GET /api/users/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user's own profile
   * PUT /api/users/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user password
   * PUT /api/users/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Old password and new password are required'
        });
      }

      await userService.changePassword(req.user.userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

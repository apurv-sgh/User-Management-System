const userService = require('../services/userService');
const { AppError } = require('../utils/errorHandler');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const { role, status, search, page = 1, limit = 10 } = req.query;

      const result = await userService.getAllUsers(
        { role, status, search },
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body, req.user.userId);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(
        req.params.userId,
        req.body,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(
        req.params.userId,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req, res, next) {
    try {
      const stats = await userService.getUserStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      // Users can only update their own profile
      const userId = req.user.userId;
      const { name, email } = req.body;

      // Remove role and status from updates if regular user
      const updates = { name, email };

      const user = await userService.updateUser(userId, updates, userId);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

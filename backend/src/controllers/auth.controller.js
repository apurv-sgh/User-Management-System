const authService = require('../services/auth.service');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const user = await authService.registerUser({
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const tokens = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user (client-side action, just send 200)
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      // Logout is typically handled on client side by clearing tokens
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

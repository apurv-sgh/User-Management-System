const { ROLE_PERMISSIONS } = require('../constants/roles');

/**
 * Middleware factory for role-based authorization
 * @param {...string} allowedRoles - Allowed roles
 * @returns {function} Express middleware
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({
          success: false,
          message: 'User role not found. Please login again.'
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to access this resource.',
          requiredRoles: allowedRoles,
          userRole: userRole
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Role authorization error',
        error: error.message
      });
    }
  };
};

module.exports = roleMiddleware;

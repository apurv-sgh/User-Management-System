const { verifyToken } = require('../utils/generateToken');

/**
 * Middleware to verify JWT token
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.'
      });
    }

    // Verify token
    const decoded = verifyToken(token, 'access');

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;

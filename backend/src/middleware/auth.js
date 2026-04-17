const { AppError } = require('../utils/errorHandler');
const { verifyAccessToken } = require('../utils/jwt');

// Verify JWT token and attach user to request
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role(s): ${roles.join(', ')}`,
          403
        )
      );
    }

    next();
  };
};

// Check if user can perform action on target user
const canManageUser = (req, res, next) => {
  const { userId } = req.params;
  const { user } = req;

  // User can only manage themselves unless they're Admin or Manager
  if (user.role === 'User' && user.userId !== userId) {
    return next(new AppError('You can only manage your own profile', 403));
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  canManageUser,
};

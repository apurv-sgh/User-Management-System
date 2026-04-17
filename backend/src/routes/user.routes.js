const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { validateCreateUser, validateUpdateUser, validateUpdateProfile } = require('../validations/user.validation');
const handleValidationErrors = require('../middlewares/validate.middleware');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination, search, filter)
 * @access  Private (Admin, Manager)
 */
router.get('/', roleMiddleware('admin', 'manager'), (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private (Admin only)
 */
router.post('/', 
  roleMiddleware('admin'),
  validateCreateUser,
  handleValidationErrors,
  (req, res, next) => {
    userController.createUser(req, res, next);
  }
);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private (All authenticated users)
 * @note    Must come before /:id route
 */
router.get('/profile', (req, res, next) => {
  userController.getProfile(req, res, next);
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private (All authenticated users)
 */
router.put('/profile', validateUpdateProfile, handleValidationErrors, (req, res, next) => {
  userController.updateProfile(req, res, next);
});

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private (All authenticated users)
 */
router.put('/change-password', (req, res, next) => {
  userController.changePassword(req, res, next);
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin, Manager can view any user; User can view own profile)
 */
router.get('/:id', (req, res, next) => {
  // Check if user is viewing own profile or is admin/manager
  if (req.user.userId === req.params.id) {
    return userController.getUserById(req, res, next);
  }

  // Only admin and manager can view other users
  if (req.user.role === 'admin' || req.user.role === 'manager') {
    return userController.getUserById(req, res, next);
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden: You can only view your own profile.'
  });
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin, Manager)
 */
router.put('/:id',
  roleMiddleware('admin', 'manager'),
  validateUpdateUser,
  handleValidationErrors,
  (req, res, next) => {
    userController.updateUser(req, res, next);
  }
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', roleMiddleware('admin'), (req, res, next) => {
  userController.deleteUser(req, res, next);
});

module.exports = router;

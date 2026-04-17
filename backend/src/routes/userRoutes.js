const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('Admin', 'Manager'), userController.getAllUsers);
router.post('/', authorize('Admin'), userController.createUser);
router.get('/stats', authorize('Admin'), userController.getUserStats);

// Admin and Manager can view users, but only Admin can modify certain fields
router.get(
  '/:userId',
  authorize('Admin', 'Manager', 'User'),
  userController.getUserById
);

// Update user - different logic based on user role
router.put('/:userId', authenticate, userController.updateUser);

// Delete user - Admin only
router.delete('/:userId', authorize('Admin'), userController.deleteUser);

// User profile routes
router.get('/profile/me', authenticate, userController.getUserById);
router.put('/profile/update', authenticate, userController.updateProfile);

module.exports = router;

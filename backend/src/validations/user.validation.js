const { body, validationResult } = require('express-validator');

// Create user validation
const validateCreateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('role')
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status')
];

// Update user validation
const validateUpdateUser = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status')
];

// Update profile validation
const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('currentPassword')
    .if(() => false) // Only validate if password change is included
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateUpdateProfile
};

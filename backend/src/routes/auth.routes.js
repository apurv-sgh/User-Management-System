const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validations/auth.validation');
const handleValidationErrors = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, handleValidationErrors, (req, res, next) => {
  authController.register(req, res, next);
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, (req, res, next) => {
  authController.login(req, res, next);
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', (req, res, next) => {
  authController.refreshToken(req, res, next);
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', (req, res, next) => {
  authController.logout(req, res, next);
});

module.exports = router;

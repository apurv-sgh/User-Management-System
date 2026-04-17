const { sendErrorResponse, AppError } = require('../utils/errorHandler');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    err = new AppError(messages, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(
      `A user with this ${field} already exists`,
      400
    );
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    err = new AppError('Invalid ID format', 400);
  }

  // Set default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  return sendErrorResponse(res, err);
};

module.exports = errorHandler;

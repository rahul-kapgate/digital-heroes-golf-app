import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  logger.error({
    err,
    path: req.path,
    method: req.method,
  }, 'Request error');

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};
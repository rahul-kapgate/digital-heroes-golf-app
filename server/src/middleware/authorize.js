import { ApiError } from '../utils/ApiError.js';

// Role-based authorization middleware
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
};
import { ApiError } from '../utils/ApiError.js';

// Validates request against Zod schema
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', result.error.format()));
    }

    req[source] = result.data;
    next();
  };
};
import { verifyToken } from '../utils/jwt.js';
import { supabase } from '../lib/supabase.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  // Fetch fresh user data
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, selected_charity_id, charity_percentage')
    .eq('id', decoded.userId)
    .single();

  if (error || !user) {
    throw ApiError.unauthorized('User not found');
  }

  req.user = user;
  next();
});
import { supabase } from '../lib/supabase.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Ensures user has an active subscription
export const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, status, current_period_end')
    .eq('user_id', req.user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to verify subscription');

  if (!data) {
    throw ApiError.forbidden('Active subscription required');
  }

  // Check if period ended
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
    throw ApiError.forbidden('Subscription has expired');
  }

  req.subscription = data;
  next();
});
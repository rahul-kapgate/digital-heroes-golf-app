// Prize pool distribution (must sum to 100)
export const PRIZE_POOL_DISTRIBUTION = {
  FIVE_MATCH: 0.40,   // 40% - rolls over if no winner
  FOUR_MATCH: 0.35,   // 35%
  THREE_MATCH: 0.25,  // 25%
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    type: 'monthly',
    amount: 500,
    currency: 'INR',
    interval: 'month',
  },
  YEARLY: {
    type: 'yearly',
    amount: 5000,
    currency: 'INR',
    interval: 'year',
  },
};

// Score rules
export const SCORE_RULES = {
  MIN_SCORE: 1,
  MAX_SCORE: 45,
  MAX_SCORES_PER_USER: 5,
};

// Charity rules
export const CHARITY_RULES = {
  MIN_PERCENTAGE: 10,
  MAX_PERCENTAGE: 100,
};

// Draw rules
export const DRAW_RULES = {
  NUMBERS_TO_MATCH: 5,
  MIN_NUMBER: 1,
  MAX_NUMBER: 45,
};

// User roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
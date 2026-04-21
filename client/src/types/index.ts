// ==========================================
// USER & AUTH
// ==========================================
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  selected_charity_id: string | null;
  charity_percentage: number;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ==========================================
// CHARITY
// ==========================================
export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  total_contributions?: number;
  created_at: string;
}

// ==========================================
// SUBSCRIPTION
// ==========================================
export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "lapsed"
  | "past_due"
  | "trialing";

export type PlanType = "monthly" | "yearly";

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancelled_at: string | null;
  created_at: string;
}

// ==========================================
// SCORES
// ==========================================
export interface Score {
  id: string;
  user_id: string;
  score: number;
  play_date: string;
  created_at: string;
}

// ==========================================
// DRAWS
// ==========================================
export type DrawStatus = "pending" | "simulated" | "published";
export type DrawType = "random" | "algorithmic";
export type MatchType = "5-match" | "4-match" | "3-match";

export interface Draw {
  id: string;
  draw_month: string;
  draw_numbers: number[];
  draw_type: DrawType;
  status: DrawStatus;
  total_pool: number;
  pool_5_match: number;
  pool_4_match: number;
  pool_3_match: number;
  rollover_amount: number;
  executed_at: string | null;
  published_at: string | null;
  created_at: string;
}

// ==========================================
// WINNERS
// ==========================================
export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: MatchType;
  prize_amount: number;
  verification_status: "pending" | "proof_uploaded" | "approved" | "rejected";
  payment_status: "pending" | "paid";
  proof_url: string | null;
  proof_uploaded_at: string | null;
  verified_at: string | null;
  paid_at: string | null;
  admin_notes: string | null;
  created_at: string;
  users?: { id: string; email: string; full_name: string };
  draws?: { draw_month: string; draw_numbers?: number[] };
}

// ==========================================
// DASHBOARD
// ==========================================
export interface DashboardData {
  subscription: Subscription | null;
  charity: Charity | null;
  charity_percentage: number;
  scores: Score[];
  winnings: Winner[];
  stats: {
    draws_entered: number;
    total_won: number;
  };
}

// ==========================================
// ADMIN
// ==========================================
export interface AdminAnalytics {
  total_users: number;
  active_subscriptions: number;
  total_draws: number;
  total_prizes_awarded: number;
  total_charity_contributions: number;
}

export interface AdminUser extends User {
  charities?: { name: string };
}

// ==========================================
// API WRAPPER
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  details?: unknown;
}
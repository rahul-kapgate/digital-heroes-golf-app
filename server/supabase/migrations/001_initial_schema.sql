-- =====================================================
-- DIGITAL HEROES GOLF PLATFORM - DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  selected_charity_id UUID,
  charity_percentage DECIMAL(5,2) DEFAULT 10.00 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- =====================================================
-- CHARITIES TABLE
-- =====================================================
CREATE TABLE charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_charities_featured ON charities(is_featured);
CREATE INDEX idx_charities_active ON charities(is_active);

-- Add FK for user's selected charity
ALTER TABLE users ADD CONSTRAINT fk_user_charity 
  FOREIGN KEY (selected_charity_id) REFERENCES charities(id) ON DELETE SET NULL;

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'lapsed', 'past_due', 'trialing')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);

-- =====================================================
-- SCORES TABLE (5-score rolling)
-- =====================================================
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  play_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, play_date)
);

CREATE INDEX idx_scores_user_date ON scores(user_id, play_date DESC);

-- =====================================================
-- DRAWS TABLE
-- =====================================================
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_month VARCHAR(7) UNIQUE NOT NULL, -- e.g. "2026-04"
  draw_numbers INTEGER[] NOT NULL, -- 5 numbers drawn
  draw_type VARCHAR(20) NOT NULL CHECK (draw_type IN ('random', 'algorithmic')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'published')),
  total_pool DECIMAL(12,2) DEFAULT 0,
  pool_5_match DECIMAL(12,2) DEFAULT 0,
  pool_4_match DECIMAL(12,2) DEFAULT 0,
  pool_3_match DECIMAL(12,2) DEFAULT 0,
  rollover_amount DECIMAL(12,2) DEFAULT 0,
  executed_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_draws_month ON draws(draw_month DESC);
CREATE INDEX idx_draws_status ON draws(status);

-- =====================================================
-- DRAW ENTRIES TABLE (snapshot of user's 5 scores when draw runs)
-- =====================================================
CREATE TABLE draw_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_scores INTEGER[] NOT NULL, -- snapshot of their 5 scores
  matches INTEGER DEFAULT 0, -- how many matched
  match_type VARCHAR(20), -- '5-match', '4-match', '3-match', or null
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(draw_id, user_id)
);

CREATE INDEX idx_draw_entries_draw ON draw_entries(draw_id);
CREATE INDEX idx_draw_entries_user ON draw_entries(user_id);

-- =====================================================
-- WINNERS TABLE
-- =====================================================
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_type VARCHAR(20) NOT NULL CHECK (match_type IN ('5-match', '4-match', '3-match')),
  prize_amount DECIMAL(12,2) NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'proof_uploaded', 'approved', 'rejected')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  proof_url TEXT,
  proof_uploaded_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_winners_draw ON winners(draw_id);
CREATE INDEX idx_winners_user ON winners(user_id);
CREATE INDEX idx_winners_verification ON winners(verification_status);

-- =====================================================
-- CHARITY CONTRIBUTIONS TABLE
-- =====================================================
CREATE TABLE charity_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE RESTRICT,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  type VARCHAR(20) DEFAULT 'subscription' CHECK (type IN ('subscription', 'donation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contributions_user ON charity_contributions(user_id);
CREATE INDEX idx_contributions_charity ON charity_contributions(charity_id);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charities_updated_at BEFORE UPDATE ON charities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
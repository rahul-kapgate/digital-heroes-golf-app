# Digital Heroes Backend

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
- Create a new Supabase project
- Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
- Run `supabase/seed.sql` to populate sample charities
- Copy URL, anon key, and service role key to `.env`

### 3. Set up Stripe (Test Mode)
- Create a Stripe account (no activation needed)
- Go to Dashboard → Products → Create:
  - "Monthly Plan" — ₹500/month recurring
  - "Yearly Plan" — ₹5000/year recurring
- Copy price IDs to `.env`
- Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
- Run: `stripe listen --forward-to localhost:3000/api/subscriptions/webhook`
- Copy the webhook secret to `.env`

### 4. Set up Resend
- Create account at resend.com
- Generate API key → paste in `.env`
- Verify domain OR use `onboarding@resend.dev` for testing

### 5. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 6. Run the server
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users
- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/users/change-password`
- `GET /api/users/dashboard`

### Scores (requires active subscription)
- `GET /api/scores`
- `POST /api/scores`
- `PATCH /api/scores/:id`
- `DELETE /api/scores/:id`

### Charities
- `GET /api/charities` (public)
- `GET /api/charities/:id` (public)
- `POST /api/charities` (admin)
- `PATCH /api/charities/:id` (admin)
- `DELETE /api/charities/:id` (admin)

### Subscriptions
- `POST /api/subscriptions/checkout`
- `GET /api/subscriptions/me`
- `POST /api/subscriptions/cancel`
- `POST /api/subscriptions/webhook` (Stripe)

### Draws
- `GET /api/draws/latest` (public)
- `GET /api/draws/:id` (public)
- `GET /api/draws` (admin)
- `POST /api/draws/run` (admin)
- `POST /api/draws/:id/publish` (admin)

### Winners
- `GET /api/winners/me`
- `POST /api/winners/:id/proof` (multipart)
- `GET /api/winners` (admin)
- `POST /api/winners/:id/verify` (admin)
- `POST /api/winners/:id/mark-paid` (admin)

### Admin
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/analytics`
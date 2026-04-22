# Digital Heroes Golf App

A full-stack golf subscription platform where users can track their golf scores, participate in monthly draws, and support charities through their subscription.

## Features

- User signup and login
- Monthly and yearly subscription plans
- Golf score entry with latest 5 score tracking
- Monthly draw and reward system
- Charity selection and contribution tracking
- Winner verification and payout status
- Admin dashboard for user, draw, charity, and winner management
- Responsive and mobile-friendly UI

## Tech Stack

- Frontend: React / Vite
- Backend: Node.js / Express
- Database: Supabase / PostgreSQL
- Authentication: JWT
- Payments: Stripe

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rahul-kapgate/digital-heroes-golf-app.git
cd digital-heroes-golf-app
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the root and add your values:

VITE_API_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DATABASE_URL=
JWT_SECRET=

```
### 4. Run the project
- npm run dev
- Available Scripts
- npm run dev - Start development server
- npm run build - Build the project
-npm run preview - Preview production build
- npm run lint - Run linting
- Project Overview

## The app allows users to:

- Subscribe to the platform
- Enter golf scores
- View draw participation
- Select a charity
- Track winnings and payment status

## Admins can:

- Manage users and subscriptions
- Run and publish monthly draws
- Manage charities
- Verify winners and payouts
- View reports and analytics

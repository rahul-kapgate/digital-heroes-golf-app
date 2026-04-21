import Stripe from 'stripe';
import { env } from '../config/env.js';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
  typescript: false,
});
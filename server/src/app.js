import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { handleStripeWebhook } from './features/subscriptions/stripe.webhook.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
app.use(cors({
  origin: "*",
  credentials: true,
}));

// 🚨 Stripe webhook MUST come BEFORE express.json() — needs raw body
app.post(
  '/api/subscriptions/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// Body parsers (for all other routes)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate limiting
app.use('/api', generalLimiter);

// Request logging
app.use((req, res, next) => {
  logger.debug({ method: req.method, path: req.path }, 'Incoming request');
  next();
});

// Mount routes
app.use('/api', routes);

// 404 + error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
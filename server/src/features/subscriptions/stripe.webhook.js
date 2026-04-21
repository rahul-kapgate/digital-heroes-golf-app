import { stripe } from '../../lib/stripe.js';
import { env } from '../../config/env.js';
import { subscriptionsService } from './subscriptions.service.js';
import { logger } from '../../utils/logger.js';

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error({ err: err.message }, 'Webhook signature verification failed');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await subscriptionsService.handleCheckoutCompleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await subscriptionsService.handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await subscriptionsService.handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.updated':
        await subscriptionsService.handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await subscriptionsService.handleSubscriptionDeleted(event.data.object);
        break;

      default:
        logger.debug({ type: event.type }, 'Unhandled webhook event');
    }

    res.json({ received: true });
  } catch (err) {
    logger.error({ err, eventType: event.type }, 'Webhook handler error');
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
import { stripe } from '../../lib/stripe.js';
import { env } from '../../config/env.js';
import { subscriptionsRepository } from './subscriptions.repository.js';
import { SUBSCRIPTION_PLANS } from '../../config/constants.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';
import { sendSubscriptionConfirmationEmail } from '../../emails/sendEmail.js';

export const subscriptionsService = {
  async createCheckoutSession(userId, planType) {
    const user = await subscriptionsRepository.getUserInfo(userId);

    // Check existing active subscription
    const existing = await subscriptionsRepository.findByUserId(userId);
    if (existing && existing.status === 'active') {
      throw ApiError.conflict('You already have an active subscription');
    }

    const priceId = planType === 'monthly'
      ? env.STRIPE_MONTHLY_PRICE_ID
      : env.STRIPE_YEARLY_PRICE_ID;

    // Create / reuse Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await subscriptionsRepository.updateStripeCustomerId(userId, customerId);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.CLIENT_URL}/dashboard?subscription=success`,
      cancel_url: `${env.CLIENT_URL}/pricing?subscription=cancelled`,
      metadata: {
        userId: user.id,
        planType,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planType,
        },
      },
    });

    return { url: session.url, sessionId: session.id };
  },

  async getMySubscription(userId) {
    return subscriptionsRepository.findByUserId(userId);
  },

  async cancelSubscription(userId) {
    const sub = await subscriptionsRepository.findByUserId(userId);
    if (!sub || sub.status !== 'active') {
      throw ApiError.badRequest('No active subscription to cancel');
    }

    // Cancel at period end
    const stripeSub = await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await subscriptionsRepository.updateByStripeSubId(sub.stripe_subscription_id, {
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    });

    return {
      message: 'Subscription will cancel at period end',
      cancel_at: new Date(stripeSub.cancel_at * 1000).toISOString(),
    };
  },

  // ==========================================
  // WEBHOOK EVENT HANDLERS
  // ==========================================
  async handleCheckoutCompleted(session) {
    logger.info({ sessionId: session.id }, 'Checkout completed');

    const userId = session.metadata.userId;
    const planType = session.metadata.planType;
    const stripeSubscriptionId = session.subscription;

    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const amount = SUBSCRIPTION_PLANS[planType.toUpperCase()].amount;

    const subscription = await subscriptionsRepository.upsert({
      user_id: userId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: session.customer,
      plan_type: planType,
      status: 'active',
      amount,
      currency: 'INR',
      current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
    });

    // Record charity contribution
    const user = await subscriptionsRepository.getUserInfo(userId);
    if (user.selected_charity_id) {
      const charityAmount = (amount * user.charity_percentage) / 100;
      await subscriptionsRepository.recordCharityContribution({
        userId,
        charityId: user.selected_charity_id,
        subscriptionId: subscription.id,
        amount: charityAmount,
        percentage: user.charity_percentage,
      });
    }

    // Send confirmation email (non-blocking)
    sendSubscriptionConfirmationEmail(user.email, user.full_name, planType, amount)
      .catch(err => logger.error({ err }, 'Failed to send subscription email'));
  },

  async handleInvoicePaymentSucceeded(invoice) {
    if (!invoice.subscription) return;

    const stripeSub = await stripe.subscriptions.retrieve(invoice.subscription);
    await subscriptionsRepository.updateByStripeSubId(invoice.subscription, {
      status: 'active',
      current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
    });
    logger.info({ subId: invoice.subscription }, 'Invoice payment succeeded');
  },

  async handleInvoicePaymentFailed(invoice) {
    if (!invoice.subscription) return;
    await subscriptionsRepository.updateByStripeSubId(invoice.subscription, {
      status: 'past_due',
    });
    logger.warn({ subId: invoice.subscription }, 'Invoice payment failed');
  },

  async handleSubscriptionDeleted(stripeSub) {
    await subscriptionsRepository.updateByStripeSubId(stripeSub.id, {
      status: 'lapsed',
      cancelled_at: new Date().toISOString(),
    });
    logger.info({ subId: stripeSub.id }, 'Subscription deleted');
  },

  async handleSubscriptionUpdated(stripeSub) {
    const status = stripeSub.cancel_at_period_end ? 'cancelled' : stripeSub.status;
    await subscriptionsRepository.updateByStripeSubId(stripeSub.id, {
      status,
      current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
    });
  },
};
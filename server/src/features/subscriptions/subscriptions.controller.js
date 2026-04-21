import { subscriptionsService } from './subscriptions.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const subscriptionsController = {
  createCheckout: asyncHandler(async (req, res) => {
    const result = await subscriptionsService.createCheckoutSession(
      req.user.id,
      req.body.planType
    );
    res.json({ success: true, data: result });
  }),

  getMy: asyncHandler(async (req, res) => {
    const sub = await subscriptionsService.getMySubscription(req.user.id);
    res.json({ success: true, data: sub });
  }),

  cancel: asyncHandler(async (req, res) => {
    const result = await subscriptionsService.cancelSubscription(req.user.id);
    res.json({ success: true, ...result });
  }),
};
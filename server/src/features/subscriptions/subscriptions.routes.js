import { Router } from 'express';
import { subscriptionsController } from './subscriptions.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createCheckoutSchema } from './subscriptions.validation.js';

const router = Router();

router.use(authenticate);

router.post('/checkout', validate(createCheckoutSchema), subscriptionsController.createCheckout);
router.get('/me', subscriptionsController.getMy);
router.post('/cancel', subscriptionsController.cancel);

// Note: Webhook is mounted separately in app.js (needs raw body)
export default router;
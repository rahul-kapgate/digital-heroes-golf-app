import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimit.js';
import { signupSchema, loginSchema } from './auth.validation.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
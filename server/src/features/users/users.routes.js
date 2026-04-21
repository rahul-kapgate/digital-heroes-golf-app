import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema } from './users.validation.js';

const router = Router();

router.use(authenticate); // All routes require auth

router.get('/me', usersController.getProfile);
router.patch('/me', validate(updateProfileSchema), usersController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), usersController.changePassword);
router.get('/dashboard', usersController.getDashboard);

export default router;
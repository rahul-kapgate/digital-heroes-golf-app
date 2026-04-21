import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id', adminController.updateUser);
router.get('/analytics', adminController.analytics);
router.patch('/scores/:scoreId', adminController.editScore);
router.delete('/scores/:scoreId', adminController.deleteScore);

export default router;
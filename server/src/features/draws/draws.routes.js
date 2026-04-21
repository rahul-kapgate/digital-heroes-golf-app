import { Router } from 'express';
import { drawsController } from './draws.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { runDrawSchema } from './draws.validation.js';

const router = Router();

// Public (published draws)
router.get('/latest', drawsController.getLatest);
router.get('/:id', drawsController.getById);

// Admin-only
router.get('/', authenticate, authorize('admin'), drawsController.list);
router.post('/run', authenticate, authorize('admin'), validate(runDrawSchema), drawsController.run);
router.post('/:id/publish', authenticate, authorize('admin'), drawsController.publish);
router.delete('/:id', authenticate, authorize('admin'), drawsController.delete);

export default router;
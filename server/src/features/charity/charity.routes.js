import { Router } from 'express';
import { charityController } from './charity.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  listCharitySchema,
  createCharitySchema,
  updateCharitySchema,
} from './charity.validation.js';

const router = Router();

// Public routes
router.get('/', validate(listCharitySchema, 'query'), charityController.list);
router.get('/:id', charityController.getById);

// Admin-only routes
router.post('/',
  authenticate,
  authorize('admin'),
  validate(createCharitySchema),
  charityController.create
);

router.patch('/:id',
  authenticate,
  authorize('admin'),
  validate(updateCharitySchema),
  charityController.update
);

router.delete('/:id',
  authenticate,
  authorize('admin'),
  charityController.delete
);

export default router;
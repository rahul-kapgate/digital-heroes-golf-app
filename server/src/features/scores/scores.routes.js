import { Router } from 'express';
import { scoresController } from './scores.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requireActiveSubscription } from '../../middleware/requireActiveSubscription.js';
import { validate } from '../../middleware/validate.js';
import { createScoreSchema, updateScoreSchema } from './scores.validation.js';

const router = Router();

router.use(authenticate);
router.use(requireActiveSubscription); // Scores require active subscription

router.get('/', scoresController.getAll);
router.post('/', validate(createScoreSchema), scoresController.create);
router.patch('/:id', validate(updateScoreSchema), scoresController.update);
router.delete('/:id', scoresController.delete);

export default router;
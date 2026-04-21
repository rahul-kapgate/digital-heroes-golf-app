import { Router } from 'express';
import { winnersController } from './winners.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadProof } from './upload.middleware.js';
import { verifyWinnerSchema } from './winners.validation.js';

const router = Router();

router.use(authenticate);

// User routes
router.get('/me', winnersController.getMyWinnings);
router.get('/:id', winnersController.getById);
router.post('/:id/proof', uploadProof, winnersController.uploadProof);

// Admin routes
router.get('/', authorize('admin'), winnersController.listAll);
router.post('/:id/verify', authorize('admin'), validate(verifyWinnerSchema), winnersController.verify);
router.post('/:id/mark-paid', authorize('admin'), winnersController.markPaid);

export default router;
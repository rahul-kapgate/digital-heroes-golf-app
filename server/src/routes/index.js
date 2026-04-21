import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes.js';
import usersRoutes from '../features/users/users.routes.js';
import scoresRoutes from '../features/scores/scores.routes.js';
import charityRoutes from '../features/charity/charity.routes.js';
import subscriptionsRoutes from '../features/subscriptions/subscriptions.routes.js';
import drawsRoutes from '../features/draws/draws.routes.js';
import winnersRoutes from '../features/winners/winners.routes.js';
import adminRoutes from '../features/admin/admin.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/scores', scoresRoutes);
router.use('/charities', charityRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/draws', drawsRoutes);
router.use('/winners', winnersRoutes);
router.use('/admin', adminRoutes);

export default router;
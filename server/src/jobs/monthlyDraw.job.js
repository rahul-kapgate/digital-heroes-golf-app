import cron from 'node-cron';
import { drawsService } from '../features/draws/draws.service.js';
import { logger } from '../utils/logger.js';

/**
 * Runs on the 1st of every month at 9:00 AM IST to simulate the draw.
 * Admin must manually publish it afterwards.
 */
export function initMonthlyDrawJob() {
  // Cron: "0 9 1 * *" = At 09:00 on day 1 of every month
  cron.schedule('0 9 1 * *', async () => {
    try {
      const now = new Date();
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const drawMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

      logger.info({ drawMonth }, 'Running monthly draw cron');

      const result = await drawsService.runDraw({
        drawMonth,
        drawType: 'random',
        simulateOnly: false,
      });

      logger.info({ drawId: result.draw?.id }, 'Monthly draw simulated — awaiting admin publish');
    } catch (err) {
      logger.error({ err }, 'Monthly draw cron failed');
    }
  }, {
    timezone: 'Asia/Kolkata',
  });

  logger.info('Monthly draw cron job scheduled');
}
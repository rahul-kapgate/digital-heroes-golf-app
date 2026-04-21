import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { initMonthlyDrawJob } from './jobs/monthlyDraw.job.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${env.PORT}`);
  logger.info(`📝 Environment: ${env.NODE_ENV}`);
  logger.info(`🌐 CORS origin: ${env.CLIENT_URL}`);

  // Start cron jobs
  initMonthlyDrawJob();
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  process.exit(1);
});
import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { configureCloudinary } from './config/cloudinary';
import { initializeSocket } from './sockets';
import { logger } from './utils/logger';
import { authRepository } from './repositories/auth.repository';

async function bootstrap() {
  try {
    await connectDatabase();
    configureCloudinary();

    const httpServer = createServer(app);
    initializeSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      logger.info(`ChatFlow AI server running on port ${env.PORT}`);
      logger.info(`API docs: ${env.API_URL}/api/docs`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });

    setInterval(() => {
      authRepository.deleteExpiredTokens().catch((err) => {
        logger.error('Failed to clean expired tokens:', err);
      });
    }, 60 * 60 * 1000);

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      httpServer.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

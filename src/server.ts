import { Server } from 'http';
import app from './app';
import config from './config';
import logger from './shared/logger';
import { redisClient } from './shared/redis';


async function bootstrap() {
  await redisClient.connect();
  const server: Server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
    console.log(`Server is running: http://localhost:${config.port}`)
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();

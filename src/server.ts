import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import logger from './shared/logger';

async function bootstrap() {
  try {
    // Connect to MongoDB
    const dbUrl = config.dbUrl;
    await mongoose
      .connect(dbUrl)
      .then(() => {
        logger.info('Connected to MongoDB');
        console.log('MongoDB connection established successfully');
      })
      .catch((error) => {
        logger.error(error);
        console.log('Database connection fail!', error);
      });

    // Start the server
    const server: Server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      console.log(`Server is running: http://localhost:${config.port}`);
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
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

bootstrap();

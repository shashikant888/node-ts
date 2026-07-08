import app from './app';
import { ENV } from './config/env';
import { prisma, pool } from './lib/prisma';
import { logger } from './utils/logger';

async function startServer() {
  try {
    logger.info("Connecting to database...");
    await prisma.$connect();
    logger.info("Database connection established successfully.");

    const server = app.listen(ENV.PORT, () => {
      logger.info(`🚀 Server running on port ${ENV.PORT}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        logger.info("HTTP server closed.");
        await prisma.$disconnect();
        await pool.end();
        logger.info("Database connection closed cleanly.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    logger.error({ err: error }, "Failed to connect to the database on startup");
    process.exit(1);
  }
}

startServer();
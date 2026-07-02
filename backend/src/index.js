import app from "./app.js";
import connectMongoDB from "./config/mongodb.js";
import { initQdrant } from "./config/qdrant.js";
import prisma from "./config/prisma.js";
import logger from "./utils/logger.js";
import { PORT } from "./config/env.js";

const start = async () => {
  try {
    // Connect all databases
    await prisma.$connect();
    logger.info("PostgreSQL connected");

    await connectMongoDB();
    await initQdrant();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received — shutting down");
  await prisma.$disconnect();
  process.exit(0);
});

start();

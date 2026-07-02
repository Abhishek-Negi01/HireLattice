import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info("MongoDB connected");
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

export default connectMongoDB;

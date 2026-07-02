import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err);

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Prisma unique constraint
  if (err.code === "P2002") {
    return res
      .status(409)
      .json({ success: false, message: "Record already exists" });
  }

  // Prisma not found
  if (err.code === "P2025") {
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  }

  const status = err.statusCode || err.status || 500;
  return res
    .status(status)
    .json({ success: false, message: err.message || "Internal server error" });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

/**
 * Global centralized error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error("[errorHandler] Error caught:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || (err.error && err.error.description) || "Internal Server Error";

  return res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;

const path = require("path");
const dotenv = require("dotenv");

// Configure environment variables before loading modules
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRouter = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");

/**
 * Creates and configures the Express server.
 */
function createServer() {
  const app = express();

  // Connect to the Database
  connectDB();

  // Middleware stack
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router mount
  app.use("/api", apiRouter);

  // Global error handler middleware
  app.use(errorHandler);

  return app;
}

module.exports = {
  createServer,
};

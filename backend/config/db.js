const mongoose = require("mongoose");

/**
 * Connects to MongoDB database using Mongoose.
 */
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/medigo";
    await mongoose.connect(mongoUrl);
    console.log("DB Connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

module.exports = connectDB;

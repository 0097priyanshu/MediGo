const mongoose = require("mongoose");
const { Schema } = mongoose;

// User schema definition
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

// Avoid model overwrite errors during hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
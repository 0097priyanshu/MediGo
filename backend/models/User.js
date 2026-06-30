const mongoose = require("mongoose");
const { Schema } = mongoose;

// User schema definition supporting Google Authentication and Role-Based Access Control
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  googleId: { type: String },
  profileImage: { type: String },
  role: { 
    type: String, 
    enum: ["customer", "store", "delivery", "admin"], 
    default: "customer" 
  },
  isApproved: { type: Boolean, default: true }, // Store defaults to false, handled during registration
  createdAt: { type: Date, default: Date.now },
  password: { type: String }, // Optional for Google OAuth users
  
  // Store Owner specific details
  shopName: { type: String },
  licenseNumber: { type: String },
  gstNumber: { type: String },
  phone: { type: String },
  address: { type: String },
  pharmacyId: { type: Schema.Types.ObjectId, ref: "Pharmacy" }
});

// Avoid model overwrite errors during hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
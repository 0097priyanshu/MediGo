const express = require("express");
const router = express.Router();
const { register, login, getProfile, googleLogin, updateStoreDetails } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Authentication endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

// Store-owner setup
router.put("/store-details", protect, updateStoreDetails);

// Get current profile
router.get("/profile", protect, getProfile);

module.exports = router;
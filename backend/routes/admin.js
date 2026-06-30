const express = require("express");
const router = express.Router();
const { getStoreRequests, approveStore, rejectStore } = require("../controllers/adminController");
const { protect, adminMiddleware } = require("../middleware/authMiddleware");

// Route protection: requires login AND admin role
router.get("/store-requests", protect, adminMiddleware, getStoreRequests);
router.patch("/store/:id/approve", protect, adminMiddleware, approveStore);
router.patch("/store/:id/reject", protect, adminMiddleware, rejectStore);

module.exports = router;

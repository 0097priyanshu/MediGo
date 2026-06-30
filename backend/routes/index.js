const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const paymentRoutes = require("./payments");
const pharmaciesRoutes = require("./pharmacies");
const medicinesRoutes = require("./medicines");
const ordersRoutes = require("./orders");
const adminRoutes = require("./admin");
const deliveryRoutes = require("./delivery");
const { getOrderStatus } = require("../controllers/paymentController");
const { handleChat } = require("../controllers/chatController");
const { handleDemo } = require("../controllers/demoController");
const { getEnvStatus } = require("../controllers/envController");

// API status ping route
router.get("/ping", (req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  return res.json({ message: ping });
});

// Mounted sub-routers
router.use("/auth", authRoutes);
router.use("/payments", paymentRoutes);
router.use("/pharmacies", pharmaciesRoutes);
router.use("/medicines", medicinesRoutes);
router.use("/orders", ordersRoutes);
router.use("/admin", adminRoutes);
router.use("/delivery", deliveryRoutes);


// Shared/standalone endpoints
router.get("/order-status/:id", getOrderStatus);
router.post("/chat", handleChat);
router.get("/demo", handleDemo);
router.get("/_env", getEnvStatus);

module.exports = router;

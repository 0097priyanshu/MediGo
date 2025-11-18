import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createOrder, verifyPayment, getOrderStatus } from "./routes/payments";
import { handleChat } from "./routes/chat";
import { authRoutes } from "./routes/auth";
import mongoose from "mongoose";


export function createServer() {
  const app = express();
  
  app.use(express.json());
  app.use("/api/auth", authRoutes);

  mongoose.connect(process.env.MONGO_URL ?? "mongodb://127.0.0.1:27017/medigo")
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));

  // Middleware
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Debug: which payment env vars are present (DO NOT return secret values)
  app.get("/api/_env", (_req, res) => {
    const keys = [
      "RZP_KEY_ID",
      "RZP_KEY_SECRET",
      "RAZORPAY_KEY_ID",
      "RAZORPAY_key_id",
      "RAZORPAY_live_key_secret",
      "RAZORPAY_key_secret",
      "RAZORPAY_key_id",
      "RAZORPAY_KEY_SECRET",
      "JWT_SECRET",
    ];
    const present: Record<string, boolean> = {};
    keys.forEach((k) => {
      present[k] = typeof process.env[k] !== "undefined" && process.env[k] !== "";
    });
    res.json({ present });
  });

  // Payments
  app.post("/api/payments/create-order", createOrder);
  app.post("/api/payments/verify", verifyPayment);
  app.get("/api/order-status/:id", getOrderStatus);

  // Chat helper
  app.post("/api/chat", handleChat);

  return app;
}

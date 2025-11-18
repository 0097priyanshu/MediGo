import { Router, RequestHandler } from "express";
import crypto from "crypto";

type OrderRecord = {
  id: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "out_for_delivery" | "delivered";
  rzpOrderId?: string;
  delivery?: { lat: number; lng: number };
};

const router = Router();
const orders = new Map<string, OrderRecord>();

/* ---------------------------- DELIVERY SIMULATION --------------------------- */
function startDeliverySimulation(localId: string) {
  const route = [
    { lat: 12.9279, lng: 77.6271 },
    { lat: 12.9285, lng: 77.6290 },
    { lat: 12.9290, lng: 77.6310 },
  ];

  let idx = 0;

  const iv = setInterval(() => {
    const r = orders.get(localId);
    if (!r) return clearInterval(iv);

    r.delivery = route[Math.min(idx, route.length - 1)];
    if (idx === 0) r.status = "out_for_delivery";

    if (idx >= route.length) {
      r.status = "delivered";
      clearInterval(iv);
    }

    idx++;
  }, 10_000);
}

/* ------------------------------- CREATE ORDER ------------------------------- */
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const { amount } = req.body;
    const currency = req.body.currency ?? "INR";

    const numericAmount = Math.max(1, Number(amount) || 0);

    const localId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Load keys (support several common env var names)
    const keyId =
      process.env.RZP_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_key_id ||
      process.env.RAZORPAY_KEYID ||
      process.env.RAZORPAY_ID ||
      process.env.RAZORPAY_KEY;

    const keySecret =
      process.env.RZP_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_live_key_secret ||
      process.env.RAZORPAY_key_secret ||
      process.env.RAZORPAY_SECRET;

    // Log presence (do NOT log secret values)
    console.log("[payments] Razorpay keyId present:", !!keyId, "keySecret present:", !!keySecret);

    // If real Razorpay keys exist, create real order
    if (keyId && keySecret) {
      const Razorpay = require("razorpay");
      const rzp = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const rzpOrder = await rzp.orders.create({
        amount: numericAmount * 100, // Razorpay expects paise
        currency,
        receipt: localId,
      });

      const record: OrderRecord = {
        id: localId,
        amount: numericAmount,
        currency,
        status: "created",
        rzpOrderId: rzpOrder.id,
      };

      orders.set(localId, record);

      return res.json({
        orderId: localId,
        rzpOrder,
        keyId, // frontend uses this!
      });
    }

    // Fallback demo (no keys)
    const fakeOrder = {
      id: `rzp_fake_${localId}`,
      amount: numericAmount * 100,
      currency,
    };

    const fakeRecord: OrderRecord = {
      id: localId,
      amount: numericAmount,
      currency,
      status: "created",
      rzpOrderId: fakeOrder.id,
    };

    orders.set(localId, fakeRecord);

    return res.json({
      orderId: localId,
      rzpOrder: fakeOrder,
      keyId: "",
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
};

/* ----------------------------- VERIFY PAYMENT ------------------------------- */
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const keySecret =
      process.env.RZP_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_live_key_secret ||
      process.env.RAZORPAY_key_secret ||
      process.env.RAZORPAY_SECRET;

    if (!orderId) return res.status(400).json({ error: "Missing orderId" });

    const record = orders.get(orderId);
    if (!record) return res.status(404).json({ error: "Order not found" });

    // Verify signature if valid data present
    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const expected = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expected !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid signature" });
      }
    }

    // Mark as paid
    record.status = "paid";
    orders.set(orderId, record);

    // Start fake delivery
    startDeliverySimulation(orderId);

    return res.json({ ok: true, orderId });
  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};

/* ------------------------------ ORDER STATUS -------------------------------- */
export const getOrderStatus: RequestHandler = (req, res) => {
  const id = req.params.id;
  const record = orders.get(id);

  if (!record) return res.status(404).json({ error: "Order not found" });

  return res.json(record);
};

/* ---------------------------- EXPORT ROUTER --------------------------------- */
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/status/:id", getOrderStatus);

export default router;
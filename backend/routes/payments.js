import { Router, RequestHandler } from "express";
import crypto from "crypto";

  amount;
  currency;
  status;
  rzpOrderId?;
  delivery?{ lat; lng};
};

const router = Router();
const orders = new Map<string, OrderRecord>();

/* ---------------------------- DELIVERY SIMULATION --------------------------- */
function startDeliverySimulation(localId) {
  const route = [
    { lat, lng},
    { lat, lng},
    { lat, lng},
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
export const createOrder= async (req, res) => {
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
    console.log("[payments] Razorpay keyId present, !!keyId, "keySecret present, !!keySecret);

    // If real Razorpay keys exist, create real order
    if (keyId && keySecret) {
      const Razorpay = require("razorpay");
      const rzp = new Razorpay({
        key_id,
        key_secret,
      });

      const rzpOrder = await rzp.orders.create({
        amount, // Razorpay expects paise
        currency,
        receipt,
      });

      const record= {
        id,
        amount,
        currency,
        status,
        rzpOrderId,
      };

      orders.set(localId, record);

      return res.json({
        orderId,
        rzpOrder,
        keyId, // frontend uses this
      });
    }

    // Fallback demo (no keys)
    const fakeOrder = {
      id{localId}`,
      amount,
      currency,
    };

    const fakeRecord= {
      id,
      amount,
      currency,
      status,
      rzpOrderId,
    };

    orders.set(localId, fakeRecord);

    return res.json({
      orderId,
      rzpOrder,
      keyId,
    });
  } catch (err) {
    console.error("Create order error, err);
    return res.status(500).json({ error});
  }
};

/* ----------------------------- VERIFY PAYMENT ------------------------------- */
export const verifyPayment= async (req, res) => {
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

    if (!orderId) return res.status(400).json({ error});

    const record = orders.get(orderId);
    if (!record) return res.status(404).json({ error});

    // Verify signature if valid data present
    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const expected = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expected !== razorpay_signature) {
        return res.status(400).json({ error});
      }
    }

    // Mark
    record.status = "paid";
    orders.set(orderId, record);

    // Start fake delivery
    startDeliverySimulation(orderId);

    return res.json({ ok, orderId });
  } catch (err) {
    console.error("Verify payment error, err);
    return res.status(500).json({ error});
  }
};

/* ------------------------------ ORDER STATUS -------------------------------- */
export const getOrderStatus= (req, res) => {
  const id = req.params.id;
  const record = orders.get(id);

  if (!record) return res.status(404).json({ error});

  return res.json(record);
};

/* ---------------------------- EXPORT ROUTER --------------------------------- */
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/status/, getOrderStatus);

export default router;
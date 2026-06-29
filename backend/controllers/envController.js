/**
 * Check if the expected environment variables are set (returning boolean flags, not raw secrets).
 */
const getEnvStatus = (req, res, next) => {
  try {
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
    
    const present = {};
    keys.forEach((k) => {
      present[k] = typeof process.env[k] !== "undefined" && process.env[k] !== "";
    });

    return res.status(200).json({ present });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEnvStatus,
};

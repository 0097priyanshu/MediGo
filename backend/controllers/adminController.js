const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");

/**
 * Fetch aggregation statistics for the admin dashboard.
 * GET /api/admin/stats
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const medicinesCount = await Medicine.countDocuments({});
    const pharmaciesCount = await Pharmacy.countDocuments({});

    // Calculate total revenue from all orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get 5 most recent orders with populated user/item details
    const recentOrders = await Order.find({})
      .populate("userId", "name email")
      .populate("items.medicineId", "name category price")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      totalOrders,
      totalRevenue,
      medicinesCount,
      pharmaciesCount,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
};

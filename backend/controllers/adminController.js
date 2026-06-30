const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");

/**
 * Returns all store registration requests that are pending approval.
 * GET /api/admin/store-requests
 */
const getStoreRequests = async (req, res, next) => {
  try {
    // Find all store users who have submitted store info (shopName is set) and are not approved yet
    const stores = await User.find({ 
      role: "store", 
      isApproved: false, 
      shopName: { $exists: true, $ne: null } 
    }).select("-password");

    return res.status(200).json({ stores });
  } catch (err) {
    next(err);
  }
};

/**
 * Approves a pending store owner.
 * Automatically creates a Pharmacy record in the DB and links its ID to the user.
 * PATCH /api/admin/store/:id/approve
 */
const approveStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const storeUser = await User.findById(id);
    
    if (!storeUser || storeUser.role !== "store") {
      return res.status(404).json({ error: "Store owner request not found" });
    }

    // Generate and register Pharmacy in DB if not already present
    let pharmacyId = storeUser.pharmacyId;
    if (!pharmacyId) {
      const pharmacy = await Pharmacy.create({
        name: storeUser.shopName,
        address: storeUser.address || "Address Pending",
        phone: storeUser.phone || "Phone Pending",
        rating: 4.5,
        isOpen: true,
      });
      pharmacyId = pharmacy._id;
    }

    storeUser.isApproved = true;
    storeUser.pharmacyId = pharmacyId;
    await storeUser.save();

    return res.status(200).json({ 
      message: "Store owner approved successfully", 
      store: {
        id: storeUser._id,
        name: storeUser.name,
        email: storeUser.email,
        role: storeUser.role,
        isApproved: storeUser.isApproved,
        pharmacyId: storeUser.pharmacyId
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Rejects a pending store owner. Resets their shop details so they can re-apply.
 * PATCH /api/admin/store/:id/reject
 */
const rejectStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const storeUser = await User.findById(id);
    
    if (!storeUser || storeUser.role !== "store") {
      return res.status(404).json({ error: "Store owner request not found" });
    }

    // Reset details to allow re-application
    storeUser.shopName = undefined;
    storeUser.licenseNumber = undefined;
    storeUser.gstNumber = undefined;
    storeUser.phone = undefined;
    storeUser.address = undefined;
    storeUser.isApproved = false;
    await storeUser.save();

    return res.status(200).json({ message: "Store request rejected and details reset successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStoreRequests,
  approveStore,
  rejectStore,
};

const Pharmacy = require("../models/Pharmacy");

/**
 * Get all pharmacies.
 * GET /api/pharmacies
 */
const getPharmacies = async (req, res, next) => {
  try {
    const pharmacies = await Pharmacy.find({});
    return res.status(200).json(pharmacies);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single pharmacy by ID.
 * GET /api/pharmacies/:id
 */
const getPharmacyById = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }
    return res.status(200).json(pharmacy);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new pharmacy.
 * POST /api/pharmacies
 */
const createPharmacy = async (req, res, next) => {
  try {
    const { name, address, phone, rating, isOpen } = req.body;

    // Validation
    if (!name || !address || !phone) {
      return res.status(400).json({ error: "Name, address, and phone are required" });
    }

    const pharmacy = await Pharmacy.create({
      name,
      address,
      phone,
      rating: rating !== undefined ? Number(rating) : 0,
      isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
    });

    return res.status(201).json({
      message: "Pharmacy created successfully",
      pharmacy,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing pharmacy by ID.
 * PUT /api/pharmacies/:id
 */
const updatePharmacy = async (req, res, next) => {
  try {
    const { name, address, phone, rating, isOpen } = req.body;

    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    // Apply updates if present in request body
    if (name !== undefined) pharmacy.name = name;
    if (address !== undefined) pharmacy.address = address;
    if (phone !== undefined) pharmacy.phone = phone;
    if (rating !== undefined) pharmacy.rating = Number(rating);
    if (isOpen !== undefined) pharmacy.isOpen = Boolean(isOpen);

    const updatedPharmacy = await pharmacy.save();

    return res.status(200).json({
      message: "Pharmacy updated successfully",
      pharmacy: updatedPharmacy,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a pharmacy by ID.
 * DELETE /api/pharmacies/:id
 */
const deletePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    await pharmacy.deleteOne();

    return res.status(200).json({
      message: "Pharmacy deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
};

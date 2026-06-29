const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");

/**
 * Get all medicines.
 * GET /api/medicines
 */
const getMedicines = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.pharmacyId) {
      filter.pharmacyId = req.query.pharmacyId;
    }
    const medicines = await Medicine.find(filter).populate("pharmacyId", "name address");
    return res.status(200).json(medicines);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single medicine by ID.
 * GET /api/medicines/:id
 */
const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("pharmacyId", "name address");
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    return res.status(200).json(medicine);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new medicine.
 * POST /api/medicines
 */
const createMedicine = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, imageUrl, pharmacyId } = req.body;

    // 1. Validation of mandatory fields
    if (!name || !category || price === undefined || stock === undefined || !pharmacyId) {
      return res.status(400).json({ error: "Name, category, price, stock, and pharmacyId are required" });
    }

    // 2. Validation of numeric values
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: "Price must be a valid number greater than or equal to 0" });
    }

    if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
      return res.status(400).json({ error: "Stock must be a valid integer greater than or equal to 0" });
    }

    // 3. Validate referenced pharmacyId exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(400).json({ error: "Invalid pharmacyId: Pharmacy does not exist" });
    }

    const medicine = await Medicine.create({
      name,
      description,
      category,
      price: numericPrice,
      stock: numericStock,
      imageUrl,
      pharmacyId,
    });

    return res.status(201).json({
      message: "Medicine created successfully",
      medicine,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing medicine by ID.
 * PUT /api/medicines/:id
 */
const updateMedicine = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, imageUrl, pharmacyId } = req.body;

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // Apply & validate updates if present in request body
    if (name !== undefined) medicine.name = name;
    if (description !== undefined) medicine.description = description;
    if (category !== undefined) medicine.category = category;
    if (imageUrl !== undefined) medicine.imageUrl = imageUrl;

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ error: "Price must be a valid number greater than or equal to 0" });
      }
      medicine.price = numericPrice;
    }

    if (stock !== undefined) {
      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
        return res.status(400).json({ error: "Stock must be a valid integer greater than or equal to 0" });
      }
      medicine.stock = numericStock;
    }

    if (pharmacyId !== undefined) {
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(400).json({ error: "Invalid pharmacyId: Pharmacy does not exist" });
      }
      medicine.pharmacyId = pharmacyId;
    }

    const updatedMedicine = await medicine.save();

    return res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a medicine by ID.
 * DELETE /api/medicines/:id
 */
const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    await medicine.deleteOne();

    return res.status(200).json({
      message: "Medicine deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};

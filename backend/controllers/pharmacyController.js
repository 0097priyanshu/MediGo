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

/**
 * Helper to calculate distance between two coordinates in km using the Haversine Formula.
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get pharmacies sorted by nearest distance.
 * GET /api/pharmacies/nearby?latitude=x&longitude=y
 */
const getNearbyPharmacies = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude query parameters are required" });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ error: "Invalid coordinates format" });
    }

    const pharmacies = await Pharmacy.find({});

    const sortedPharmacies = pharmacies.map((pharmacy) => {
      // Fallback coordinates if not populated
      const phLat = pharmacy.latitude !== undefined ? pharmacy.latitude : 28.6273;
      const phLon = pharmacy.longitude !== undefined ? pharmacy.longitude : 77.3725;
      
      const distance = haversineDistance(userLat, userLon, phLat, phLon);
      
      return {
        ...pharmacy.toObject(),
        distanceKm: parseFloat(distance.toFixed(2)),
      };
    });

    sortedPharmacies.sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json(sortedPharmacies);
  } catch (err) {
    next(err);
  }
};

/**
 * Get medicines belonging to a specific pharmacy.
 * GET /api/pharmacies/:id/medicines
 */
const getPharmacyMedicines = async (req, res, next) => {
  try {
    const Medicine = require("../models/Medicine");
    const pharmacyId = req.params.id;

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    const medicines = await Medicine.find({ pharmacyId }).select("name stock price category");
    return res.status(200).json(medicines);
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
  getNearbyPharmacies,
  getPharmacyMedicines,
};

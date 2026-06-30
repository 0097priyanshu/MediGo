const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");

// Fetch Google Client ID from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.Client_Id;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Google OAuth Authentication handler.
 * Verifies ID token, finds or registers the user, and signs a backend JWT.
 * POST /api/auth/google
 */
const googleLogin = async (req, res, next) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google credential token is required" });
    }

    // Verify token with Google's public keys
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ error: "Google email is not verified" });
    }

    // Determine the requested role (defaults to customer)
    const selectedRole = role || "customer";

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user record
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
        role: selectedRole,
        // Stores default to unapproved, customer/delivery auto-approve
        isApproved: selectedRole === "store" ? false : true,
      });
    } else {
      // Update Google profile info if not already stored
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.profileImage) {
        user.profileImage = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    // Generate JWT token containing payload: id and role
    const token = generateToken({ id: user._id, role: user.role });

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
        shopName: user.shopName,
        pharmacyId: user.pharmacyId,
      },
    });
  } catch (err) {
    console.error("[authController] Google OAuth error:", err);
    return res.status(400).json({ error: "Invalid Google token or verification failed" });
  }
};

/**
 * Updates details for a store owner registration request.
 * PUT /api/auth/store-details
 */
const updateStoreDetails = async (req, res, next) => {
  try {
    const { shopName, licenseNumber, gstNumber, phone, address } = req.body;

    if (!shopName || !licenseNumber || !gstNumber || !phone || !address) {
      return res.status(400).json({ error: "All shop details are required for registration" });
    }

    // Ensure the current user is a store owner
    if (req.user.role !== "store") {
      return res.status(400).json({ error: "Only accounts with role 'store' can register shop details" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.shopName = shopName;
    user.licenseNumber = licenseNumber;
    user.gstNumber = gstNumber;
    user.phone = phone;
    user.address = address;
    // Set status to unapproved pending admin review
    user.isApproved = false;

    await user.save();

    return res.status(200).json({
      message: "Shop details submitted successfully. Awaiting admin approval.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
        shopName: user.shopName,
        pharmacyId: user.pharmacyId,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Registers a new user (traditional email/password backup flow).
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedRole = role || "customer";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: selectedRole,
      isApproved: selectedRole === "store" ? false : true,
    });

    const createdUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    };

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: createdUser,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticates user credentials (traditional email/password backup flow).
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If user has password, match it
    if (!user.password) {
      return res.status(400).json({ error: "Please log in using Google Authentication" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
        shopName: user.shopName,
        pharmacyId: user.pharmacyId,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Returns the profile details of the authenticated user.
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  googleLogin,
  updateStoreDetails,
};

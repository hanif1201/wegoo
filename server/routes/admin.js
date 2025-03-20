// routes/admin.js
const express = require("express");
const {
  login,
  getMe,
  getUsers,
  getUserById,
  updateUserStatus,
  getUserStats,
  getRiders,
  getRiderById,
  updateRiderStatus,
  verifyRiderDocument,
  getRiderStats,
  getRides,
  getRideById,
  updateRideStatus,
  getRideStats,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/login", login);

// Protected routes - all routes below will use authentication middleware
router.use(protect);
router.use(authorize("admin"));

// Admin profile
router.get("/me", getMe);

// User routes
router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/status", updateUserStatus);
router.get("/users/stats", getUserStats);

// Rider routes
router.get("/riders", getRiders);
router.get("/riders/:riderId", getRiderById);
router.put("/riders/:riderId/status", updateRiderStatus);
router.put("/riders/:riderId/documents/:documentId", verifyRiderDocument);
router.get("/riders/stats", getRiderStats);

// Ride routes
router.get("/rides", getRides);
router.get("/rides/:rideId", getRideById);
router.put("/rides/:rideId/status", updateRideStatus);
router.get("/rides/stats", getRideStats);

// Dashboard route
router.get("/dashboard", getDashboardStats);

module.exports = router;

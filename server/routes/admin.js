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

// Debug middleware for all admin routes
router.use((req, res, next) => {
  console.log("Admin Route Debug:", {
    path: req.path,
    token: req.headers.authorization,
    decodedToken: req.user,
    method: req.method,
  });
  next();
});

// Public routes
router.post("/login", login);

// Debug middleware before protect
router.use((req, res, next) => {
  console.log("Pre-Auth Debug:", {
    path: req.path,
    token: req.headers.authorization,
    method: req.method,
  });
  next();
});

// Protected routes - all routes below will use authentication middleware
router.use(protect);

// Debug middleware after protect
router.use((req, res, next) => {
  console.log("Post-Protect Debug:", {
    path: req.path,
    user: req.user,
    method: req.method,
  });
  next();
});

router.use(authorize("admin"));

// Debug middleware after authorize
router.use((req, res, next) => {
  console.log("Post-Authorize Debug:", {
    path: req.path,
    user: req.user,
    method: req.method,
  });
  next();
});

// Dashboard route (most specific)
router.get("/dashboard", getDashboardStats);

// Admin profile
router.get("/me", getMe);

// Stats routes (more specific routes)
router.get("/users/stats", getUserStats);
router.get("/riders/stats", getRiderStats);
router.get("/rides/stats", getRideStats);

// Collection routes (less specific)
router.get("/users", getUsers);
router.get("/riders", getRiders);
router.get("/rides", getRides);

// Parameterized routes (least specific)
router.get("/users/:userId", getUserById);
router.put("/users/:userId/status", updateUserStatus);

router.get("/riders/:riderId", getRiderById);
router.put("/riders/:riderId/status", updateRiderStatus);
router.put("/riders/:riderId/documents/:documentId", verifyRiderDocument);

router.get("/rides/:rideId", getRideById);
router.put("/rides/:rideId/status", updateRideStatus);

module.exports = router;

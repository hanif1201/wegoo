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

router.use((req, res, next) => {
  console.log("Admin Route Debug:", {
    path: req.path,
    token: req.headers.authorization,
    decodedToken: req.user, // If you're attaching the decoded token to req.user
    method: req.method,
  });
  next();
});

// Public routes
router.post("/login", login);

// Add debugging middleware before protect
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

// Add debugging middleware after protect but before authorize
router.use((req, res, next) => {
  console.log("Post-Protect Debug:", {
    path: req.path,
    user: req.user, // This should now exist if protect worked
    method: req.method,
  });
  next();
});

router.use(authorize("admin"));

// Add debugging middleware after authorize
router.use((req, res, next) => {
  console.log("Post-Authorize Debug:", {
    path: req.path,
    user: req.user,
    method: req.method,
  });
  next();
});

// Admin profile
router.get("/me", getMe);

// User routes
router.get("/users/stats", getUserStats); // Move this BEFORE the :userId route

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/status", updateUserStatus);
// Rider routes
router.get("/rides/stats", getRideStats);
router.get("/riders", getRiders);
router.get("/riders/:riderId", getRiderById);
router.put("/riders/:riderId/status", updateRiderStatus);
router.put("/riders/:riderId/documents/:documentId", verifyRiderDocument);
router.get("/riders/stats", getRiderStats);

// Ride routes

router.get("/rides", getRides);
router.get("/rides/:rideId", getRideById);
router.put("/rides/:rideId/status", updateRideStatus);

// Dashboard route
router.get("/dashboard", getDashboardStats);

module.exports = router;

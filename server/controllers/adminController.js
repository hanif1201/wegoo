// controllers/adminController.js
const User = require("../models/User");
const Rider = require("../models/Rider");
const Ride = require("../models/Ride");
const Admin = require("../models/Admin"); // You'll need to create this model

// Admin Authentication
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for admin - make sure to include password field
    const admin = await Admin.findOne({ email }).select("+password");
    console.log("Found admin:", admin ? admin.email : "not found"); // For debugging

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    console.log("Password match:", isMatch); // For debugging

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = admin.getSignedJwtToken();
    console.log("Generated token for admin"); // For debugging

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// USER MANAGEMENT
// Get all users with pagination
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const searchRegex = new RegExp(search, "i");

    const query = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ],
    };

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      currentPage: page,
      totalPages,
      totalItems: totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user details
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get additional user statistics
    const rides = await Ride.find({ userId: user._id });

    const userStats = {
      totalRides: rides.length,
      totalSpent: rides.reduce((sum, ride) => sum + ride.fare.total, 0),
    };

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), ...userStats },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get statistics for dashboard
exports.getUserStats = async (req, res) => {
  try {
    // Add debug logging
    console.log("Fetching ride count...");

    // Get all completed rides instead of just counting
    const rides = await Ride.find({}).lean();
    console.log("All rides:", rides);

    const totalRides = rides.length;
    console.log("Total rides found:", totalRides);

    // Calculate total revenue from completed rides
    const totalRevenue = rides.reduce((sum, ride) => {
      console.log("Processing ride:", ride._id, "Fare:", ride.fare?.total);
      return sum + (ride.fare?.total || 0);
    }, 0);
    console.log("Total revenue calculated:", totalRevenue);

    const totalUsers = await User.countDocuments();
    const totalRiders = await Rider.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    const activeUsers = await User.countDocuments({ status: "active" });
    const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalRiders,
      totalRides,
      totalRevenue, // Add this to the response
      newUsersToday,
      retentionRate: Number(retentionRate.toFixed(2)),
    });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
};
// RIDER MANAGEMENT
// Get all riders with pagination
exports.getRiders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const searchRegex = new RegExp(search, "i");

    const query = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { "vehicleDetails.licensePlate": searchRegex },
      ],
    };

    const totalRiders = await Rider.countDocuments(query);
    const totalPages = Math.ceil(totalRiders / limit);

    const riders = await Rider.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: riders,
      currentPage: page,
      totalPages,
      totalItems: totalRiders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get rider details
exports.getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.riderId);

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    // Get additional rider statistics
    const rides = await Ride.find({ riderId: rider._id });

    const riderStats = {
      totalRides: rides.length,
      totalEarnings: rides.reduce((sum, ride) => sum + ride.fare.total, 0),
      completionRate:
        rides.length > 0
          ? (rides.filter((ride) => ride.status === "completed").length /
              rides.length) *
            100
          : 0,
      averageRating:
        rides.length > 0
          ? rides.reduce((sum, ride) => sum + (ride.riderRating || 0), 0) /
            rides.filter((ride) => ride.riderRating).length
          : 0,
    };

    res.status(200).json({
      success: true,
      data: { ...rider.toObject(), ...riderStats },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update rider status
exports.updateRiderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "suspended", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const rider = await Rider.findByIdAndUpdate(
      req.params.riderId,
      { verificationStatus: status },
      { new: true }
    );

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify rider document
exports.verifyRiderDocument = async (req, res) => {
  try {
    const { verificationStatus } = req.body;

    if (!["pending", "verified", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status",
      });
    }

    const rider = await Rider.findById(req.params.riderId);

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    // Find the document and update its status
    const documentIndex = rider.documents.findIndex(
      (doc) => doc._id.toString() === req.params.documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    rider.documents[documentIndex].verificationStatus = verificationStatus;

    // Auto-approve rider if all documents are verified
    if (verificationStatus === "verified") {
      const allVerified = rider.documents.every(
        (doc) => doc.verificationStatus === "verified"
      );
      if (allVerified) {
        rider.verificationStatus = "approved";
      }
    }

    await rider.save();

    res.status(200).json({
      success: true,
      data: rider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get rider statistics
exports.getRiderStats = async (req, res) => {
  try {
    const totalRiders = await Rider.countDocuments();
    const activeRiders = await Rider.countDocuments({
      verificationStatus: "approved",
      isAvailable: true,
    });
    const pendingVerification = await Rider.countDocuments({
      verificationStatus: "pending",
    });

    // Get all completed rides
    const rides = await Ride.find({ status: "completed" });
    const totalRides = rides.length; // Count all rides

    // Calculate total earnings from all rides
    const totalEarnings = rides.reduce((sum, ride) => sum + ride.fare.total, 0);

    res.status(200).json({
      success: true,
      totalRiders,
      activeRiders,
      totalRides,
      pendingVerification,
      totalEarnings,
      avgEarningsPerRider: totalRiders > 0 ? totalEarnings / totalRiders : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RIDE MANAGEMENT
// Get all rides with pagination and filters
exports.getRides = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, dateFrom, dateTo } = req.query;

    const query = {};

    // Apply status filter
    if (status) {
      query.status = status;
    }

    // Apply date range filter
    if (dateFrom || dateTo) {
      query.requestTime = {};
      if (dateFrom) {
        query.requestTime.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.requestTime.$lte = new Date(dateTo);
      }
    }

    const totalRides = await Ride.countDocuments(query);
    const totalPages = Math.ceil(totalRides / limit);

    const rides = await Ride.find(query)
      .populate("userId", "name email phone")
      .populate("riderId", "name email phone vehicleDetails")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ requestTime: -1 });

    res.status(200).json({
      success: true,
      data: rides,
      currentPage: page,
      totalPages,
      totalItems: totalRides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ride details
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate("userId", "name email phone")
      .populate("riderId", "name email phone vehicleDetails");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update ride status (admin override)
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      ![
        "requested",
        "accepted",
        "in-progress",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      {
        status,
        ...(status === "cancelled" && { cancellationReason: "Admin override" }),
      },
      { new: true }
    )
      .populate("userId", "name email phone")
      .populate("riderId", "name email phone vehicleDetails");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ride statistics
exports.getRideStats = async (req, res) => {
  try {
    const period = req.query.period || "week";

    // Define date range based on the period
    let startDate;
    const endDate = new Date();

    switch (period) {
      case "day":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get total rides in the period
    const totalRides = await Ride.countDocuments({
      requestTime: { $gte: startDate, $lte: endDate },
    });

    // Get total completed rides
    const completedRides = await Ride.countDocuments({
      status: "completed",
      requestTime: { $gte: startDate, $lte: endDate },
    });

    // Get total cancelled rides
    const cancelledRides = await Ride.countDocuments({
      status: "cancelled",
      requestTime: { $gte: startDate, $lte: endDate },
    });

    // Get total revenue
    const rides = await Ride.find({
      status: "completed",
      requestTime: { $gte: startDate, $lte: endDate },
    });

    const totalRevenue = rides.reduce((sum, ride) => sum + ride.fare.total, 0);

    // Calculate average metrics
    const avgDistance =
      rides.length > 0
        ? rides.reduce((sum, ride) => sum + (ride.route?.distance || 0), 0) /
          rides.length
        : 0;

    const avgDuration =
      rides.length > 0
        ? rides.reduce((sum, ride) => sum + (ride.route?.duration || 0), 0) /
          rides.length
        : 0;

    const avgFare = rides.length > 0 ? totalRevenue / rides.length : 0;

    // Group rides by day for chart data
    const ridesByDay = {};
    rides.forEach((ride) => {
      const day = new Date(ride.requestTime).toISOString().split("T")[0];
      if (!ridesByDay[day]) {
        ridesByDay[day] = {
          count: 0,
          revenue: 0,
        };
      }
      ridesByDay[day].count += 1;
      ridesByDay[day].revenue += ride.fare.total;
    });

    const chartData = Object.keys(ridesByDay).map((day) => ({
      day,
      count: ridesByDay[day].count,
      revenue: ridesByDay[day].revenue,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalRides,
        completedRides,
        cancelledRides,
        completionRate:
          totalRides > 0 ? (completedRides / totalRides) * 100 : 0,
        cancellationRate:
          totalRides > 0 ? (cancelledRides / totalRides) * 100 : 0,
        totalRevenue,
        avgDistance,
        avgDuration,
        avgFare,
        chartData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get dashboard overview stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Count users, riders, and rides
    const totalUsers = await User.countDocuments();
    const totalRiders = await Rider.countDocuments();
    const totalRides = await Ride.countDocuments();

    // New users and riders today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    const newRidersToday = await Rider.countDocuments({
      createdAt: { $gte: today },
    });

    // Rides today
    const ridesToday = await Ride.countDocuments({
      requestTime: { $gte: today },
    });

    // Revenue today
    const todayRides = await Ride.find({
      status: "completed",
      dropoffTime: { $gte: today },
    });

    const revenueToday = todayRides.reduce(
      (sum, ride) => sum + ride.fare.total,
      0
    );

    // Active riders now
    const activeRiders = await Rider.countDocuments({
      isAvailable: true,
    });

    // Get last 7 days revenue data
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const revenueData = await Ride.aggregate([
      {
        $match: {
          status: "completed",
          dropoffTime: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dropoffTime" } },
          revenue: { $sum: "$fare.total" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format for chart
    const chartData = revenueData.map((day) => ({
      date: day._id,
      revenue: day.revenue,
      rides: day.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRiders,
        totalRides,
        newUsersToday,
        newRidersToday,
        ridesToday,
        revenueToday,
        activeRiders,
        chartData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

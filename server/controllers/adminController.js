const User = require("../models/User");
const Rider = require("../models/Rider");
const Ride = require("../models/Ride");

// Get current admin profile
exports.getMe = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json(stats[0] || { total: 0, active: 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get ride statistics
exports.getRideStats = async (req, res) => {
  try {
    const { period = "week" } = req.query;

    let dateFilter = {};
    if (period === "week") {
      dateFilter = {
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      };
    }

    const stats = await Ride.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json(stats[0] || { total: 0, completed: 0, cancelled: 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get rider statistics
exports.getRiderStats = async (req, res) => {
  try {
    const stats = await Rider.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json(stats[0] || { total: 0, active: 0, pending: 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, riders, rides] = await Promise.all([
      exports.getUserStats(req, { json: (data) => data }),
      exports.getRiderStats(req, { json: (data) => data }),
      exports.getRideStats(req, { json: (data) => data }),
    ]);

    res.json({
      users,
      riders,
      rides,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

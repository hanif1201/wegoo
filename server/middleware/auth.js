// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Rider = require("../models/Rider");

exports.protect = async (req, res, next) => {
  let token;

  // Check if auth header exists and has the right format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is for user or rider
    if (decoded.type === "rider") {
      req.user = await Rider.findById(decoded.id);
      req.userType = "rider";
    } else {
      req.user = await User.findById(decoded.id);
      req.userType = "user";
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userType)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.userType} is not authorized to access this route`,
      });
    }
    next();
  };
};

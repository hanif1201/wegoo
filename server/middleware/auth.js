// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Rider = require("../models/Rider");

// ... existing code ...
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add admin type check
    if (decoded.type === "admin") {
      req.user = await Admin.findById(decoded.id);
      req.userType = "admin";
    } else {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access admin routes",
      });
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

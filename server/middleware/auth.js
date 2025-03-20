// middleware/auth.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Add detailed logging
    console.log("Token verification attempt:", {
      hasAuth: !!req.headers.authorization,
      secret: process.env.JWT_SECRET?.substring(0, 5) + "...", // Log first 5 chars of secret for debugging
    });

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", {
        id: decoded.id,
        role: decoded.role,
        exp: new Date(decoded.exp * 1000).toISOString(),
      });
      req.user = decoded;
      next();
    } catch (error) {
      console.log("Token verification failed:", {
        error: error.message,
        token: token.substring(0, 20) + "...",
        secret: process.env.JWT_SECRET?.substring(0, 5) + "...",
      });
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log("Protect middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "User not found in request" });
    }

    console.log("Authorization check:", {
      userRole: req.user.role,
      requiredRoles: roles,
    });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

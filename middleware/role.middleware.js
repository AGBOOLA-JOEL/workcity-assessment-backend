const User = require("../models/user.model");

// @desc    Grant access to specific roles
// @access  Private
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get user from database to check current role
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user's role is included in the allowed roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${user.role}' is not authorized to access this route`,
        });
      }

      // Add user object to request for use in controllers
      req.currentUser = user;
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking user authorization",
      });
    }
  };
};

// @desc    Grant access to admin only
// @access  Private
const adminOnly = authorize("admin");

// @desc    Grant access to admin and user
// @access  Private
const userAndAdmin = authorize("user", "admin");

module.exports = {
  authorize,
  adminOnly,
  userAndAdmin,
};

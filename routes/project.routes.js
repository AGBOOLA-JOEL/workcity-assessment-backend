const express = require("express");
const {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly, userAndAdmin } = require("../middleware/role.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin-only operations
router.post("/", adminOnly, addProject);
router.put("/:id", adminOnly, updateProject);
router.delete("/:id", adminOnly, deleteProject);

// Both admin and user can read
router.get("/", userAndAdmin, getProjects);
router.get("/:id", userAndAdmin, getProjectById);

module.exports = router;

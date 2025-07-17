const express = require("express");
const {
  addClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/client.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly, userAndAdmin } = require("../middleware/role.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin-only operations
router.post("/", adminOnly, addClient);
router.put("/:id", adminOnly, updateClient);
router.delete("/:id", adminOnly, deleteClient);

// Both admin and user can read
router.get("/", userAndAdmin, getClients);
router.get("/:id", userAndAdmin, getClientById);

module.exports = router;

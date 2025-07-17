const Client = require("../models/client.model");

// Add a new client
const addClient = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const client = await Client.create({ name, email, phone });
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Client with this email already exists",
        });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get all clients
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().populate("projects");
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};

// Get a single client by ID
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).populate("projects");
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

// Update a client
const updateClient = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Client with this email already exists",
        });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Delete a client
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, message: "Client deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};

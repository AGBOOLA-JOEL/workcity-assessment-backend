const Project = require("../models/project.model");

// Add a new project
const addProject = async (req, res, next) => {
  try {
    const { title, description, status, deadline, clientId } = req.body;
    const project = await Project.create({
      title,
      description,
      status,
      deadline,
      clientId,
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get all projects (optionally filter by clientId)
const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.clientId) {
      filter.clientId = req.query.clientId;
    }
    const projects = await Project.find(filter).populate("clientId");
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// Get a single project by ID
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("clientId");
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Update a project
const updateProject = async (req, res, next) => {
  try {
    const { title, description, status, deadline, clientId } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, status, deadline, clientId },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Delete a project
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const Project = require("../models/project.model");
const jwt = require("jsonwebtoken");

describe("Project API", () => {
  let adminToken;
  let userToken;
  let testClient;
  let testProject;

  // Setup test data
  beforeAll(async () => {
    // Create admin user
    const adminUser = await User.create({
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET);

    // Create regular user
    const regularUser = await User.create({
      email: "user@test.com",
      password: "password123",
      role: "user",
    });
    userToken = jwt.sign({ userId: regularUser._id }, process.env.JWT_SECRET);

    // Create test client
    testClient = await Client.create({
      name: "Test Client",
      email: "test@client.com",
      phone: "+1234567890",
    });
  });

  describe("POST /api/projects", () => {
    it("should create a new project when admin is authenticated", async () => {
      const projectData = {
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        clientId: testClient._id,
      };

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(projectData)
        .expect(201)
        .expect(response.body.success)
        .toBe(true);
      expect(response.body.data.title).toBe(projectData.title);
      expect(response.body.data.description).toBe(projectData.description);
      expect(response.body.data.status).toBe(projectData.status);
    });

    it("should reject project creation when user is not admin", async () => {
      const projectData = {
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000).toISOString(),
        clientId: testClient._id,
      };

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .send(projectData)
        .expect(403)
        .expect(response.body.success)
        .toBe(false);
    });

    it("should reject project creation without authentication", async () => {
      const projectData = {
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000).toISOString(),
        clientId: testClient._id,
      };

      const response = await request(app)
        .post("/api/projects")
        .send(projectData)
        .expect(401)
        .expect(response.body.success)
        .toBe(false);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        title: "",
        description: "A test project description",
        status: "invalid-status",
        deadline: "invalid-date",
        clientId: "invalid-id",
      };

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400)
        .expect(response.body.success)
        .toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/projects", () => {
    beforeEach(async () => {
      testProject = await Project.create({
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000),
        clientId: testClient._id,
      });
    });

    it("should get all projects when authenticated", async () => {
      const response = await request(app)
        .get("/api/projects")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)
        .expect(response.body.success)
        .toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should filter projects by clientId", async () => {
      const response = await request(app)
        .get(`/api/projects?clientId=${testClient._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)
        .expect(response.body.success)
        .toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].clientId._id).toBe(
        testClient._id.toString()
      );
    });

    it("should reject access without authentication", async () => {
      const response = await request(app)
        .get("/api/projects")
        .expect(401)
        .expect(response.body.success)
        .toBe(false);
    });
  });

  describe("GET /api/projects/:id", () => {
    beforeEach(async () => {
      testProject = await Project.create({
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000),
        clientId: testClient._id,
      });
    });

    it("should get project by ID when authenticated", async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)
        .expect(response.body.success)
        .toBe(true);
      expect(response.body.data._id).toBe(testProject._id.toString());
      expect(response.body.data.title).toBe(testProject.title);
    });

    it("should return 404 for non-existent project", async () => {
      const fakeId = "507f1f77cf86cd7994390111";
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404)
        .expect(response.body.success)
        .toBe(false);
    });
  });

  describe("PUT /api/projects/:id", () => {
    beforeEach(async () => {
      testProject = await Project.create({
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000),
        clientId: testClient._id,
      });
    });

    it("should update project when admin is authenticated", async () => {
      const updateData = {
        title: "Updated Project",
        description: "Updated project description",
        status: "in progress",
        deadline: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      };

      const response = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect(response.body.success)
        .toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it("should reject update when user is not admin", async () => {
      const updateData = {
        title: "Updated Project",
        description: "Updated project description",
        status: "in progress",
      };

      const response = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(403)
        .expect(response.body.success)
        .toBe(false);
    });
  });

  describe("DELETE /api/projects/:id", () => {
    beforeEach(async () => {
      testProject = await Project.create({
        title: "Test Project",
        description: "A test project description",
        status: "pending",
        deadline: new Date(Date.now() + 86400000),
        clientId: testClient._id,
      });
    });

    it("should delete project when admin is authenticated", async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)
        .expect(response.body.success)
        .toBe(true);
      expect(response.body.message).toBe("Project deleted");
    });

    it("should reject deletion when user is not admin", async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403)
        .expect(response.body.success)
        .toBe(false);
    });
  });
});

const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const Project = require("../models/project.model");
const jwt = require("jsonwebtoken");

describe("Project API (Update Project Only)", () => {
  let adminToken;
  let testClient;
  let testProject;

  beforeAll(async () => {
    const uniqueAdminEmail = `admin_${Date.now()}@test.com`;
    const adminUser = await User.create({
      email: uniqueAdminEmail,
      password: "password123",
      role: "admin",
    });
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET);

    testClient = await Client.create({
      name: "Test Client",
      email: `test_${Date.now()}@client.com`,
      phone: "+1234567890",
    });
  });

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
      deadline: new Date(Date.now() + 172800000).toISOString(),
    };

    await request(app)
      .put(`/api/projects/${testProject._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData)
      .expect(200)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        // The response uses mapProject, so check mapped fields
        expect(response.body.data).toHaveProperty(
          "id",
          testProject._id.toString()
        );
        expect(response.body.data).toHaveProperty("name", updateData.title);
        expect(response.body.data).toHaveProperty(
          "description",
          updateData.description
        );
        // status is mapped: 'in progress' -> 'active'
        expect(response.body.data).toHaveProperty("status", "active");
        expect(new Date(response.body.data.deadline).toISOString()).toBe(
          updateData.deadline
        );
        expect(response.body.data).toHaveProperty(
          "clientId",
          testClient._id.toString()
        );
        expect(response.body.data).toHaveProperty("createdAt");
      });
  });
});

const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const jwt = require("jsonwebtoken");

describe("Client API", () => {
  let adminToken;
  let userToken;
  let testClient;

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
  });

  describe("POST /api/clients", () => {
    it("should create a new client when admin is authenticated", async () => {
      const clientData = {
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      };

      const response = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(clientData)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(clientData.name);
      expect(response.body.data.email).toBe(clientData.email);
      expect(response.body.data.phone).toBe(clientData.phone);
    });

    it("should reject client creation when user is not admin", async () => {
      const clientData = {
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      };

      const response = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${userToken}`)
        .send(clientData)
        .expect(403);
      expect(response.body.success).toBe(false);
    });

    it("should reject client creation without authentication", async () => {
      const clientData = {
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      };

      const response = await request(app)
        .post("/api/clients")
        .send(clientData)
        .expect(401);
      expect(response.body.success).toBe(false);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        name: "",
        email: "invalid-email",
        phone: "123",
      };

      const response = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/clients", () => {
    beforeEach(async () => {
      testClient = await Client.create({
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      });
    });

    it("should get all clients when authenticated", async () => {
      const response = await request(app)
        .get("/api/clients")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should reject access without authentication", async () => {
      const response = await request(app).get("/api/clients").expect(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/clients/:id", () => {
    beforeEach(async () => {
      testClient = await Client.create({
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      });
    });

    it("should get client by ID when authenticated", async () => {
      const response = await request(app)
        .get(`/api/clients/${testClient._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testClient._id.toString());
      expect(response.body.data.name).toBe(testClient.name);
    });

    it("should return 404 on non-existent client", async () => {
      const fakeId = "507f1f77cf86cd7994390111";
      const response = await request(app)
        .get(`/api/clients/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/clients/:id", () => {
    beforeEach(async () => {
      testClient = await Client.create({
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      });
    });

    it("should update client when admin is authenticated", async () => {
      const updateData = {
        name: "Updated Client",
        email: "updated@client.com",
        phone: "+0987654321",
      };

      const response = await request(app)
        .put(`/api/clients/${testClient._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
    });

    it("should reject update when user is not admin", async () => {
      const updateData = {
        name: "Updated Client",
        email: "updated@client.com",
        phone: "+0987654321",
      };

      const response = await request(app)
        .put(`/api/clients/${testClient._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/clients/:id", () => {
    beforeEach(async () => {
      testClient = await Client.create({
        name: "Test Client",
        email: "test@client.com",
        phone: "+1234567890",
      });
    });

    it("should delete client when admin is authenticated", async () => {
      const response = await request(app)
        .delete(`/api/clients/${testClient._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Client deleted");
    });

    it("should reject deletion when user is not admin", async () => {
      const response = await request(app)
        .delete(`/api/clients/${testClient._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
      expect(response.body.success).toBe(false);
    });
  });
});

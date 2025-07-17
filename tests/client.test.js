const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

describe("Client API (Create Client Only)", () => {
  let adminToken;

  beforeAll(async () => {
    const uniqueEmail = `admin_${Date.now()}@test.com`;
    const adminUser = await User.create({
      email: uniqueEmail,
      password: "password123",
      role: "admin",
    });
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET);
  });

  it("should create a new client when admin is authenticated", async () => {
    const clientData = {
      name: "Test Client",
      email: `test_${Date.now()}@client.com`,
      phone: "+1234567890",
    };

    await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(clientData)
      .expect(201)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(clientData.name);
        expect(response.body.data.email).toBe(clientData.email);
        expect(response.body.data.phone).toBe(clientData.phone);
      });
  });
});

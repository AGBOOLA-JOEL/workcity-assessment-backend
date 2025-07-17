const mongoose = require("mongoose");

// Set test environment
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = process.env.MONGODB_URI;
process.env.JWT_SECRET = "test-secret-key";

// Connect to test database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// require("dotenv").config(); // Load environment variables from .env at the very top
// const mongoose = require("mongoose");

// // Set test environment
// process.env.NODE_ENV = "test";
// process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

// // Connect to test database
// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// // Clear database after each test
// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany();
//   }
// });

// // Close database connection after all tests
// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
// });

// jest.setTimeout(20000); // 20 seconds
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

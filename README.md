# WorkCity Assessment Backend

A robust Node.js/Express backend API with MongoDB integration, JWT authentication, role-based authorization, and comprehensive testing. Built for client and project management with secure REST endpoints.

## 🚀 Features

- **🔐 Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (admin/user)
  - Secure password hashing with bcrypt
  - Protected routes with middleware

- **📊 Data Management**

  - Client management (CRUD operations)
  - Project management with client relationships
  - MongoDB with Mongoose ODM
  - Data validation with Joi

- **🛡️ Security & Validation**

  - Input validation and sanitization
  - CORS enabled
  - Global error handling
  - Request/response validation

- **📚 API Documentation**

  - Interactive Swagger UI
  - Complete endpoint documentation
  - Request/response examples
  - Authentication requirements

- **🧪 Testing**
  - Comprehensive unit tests with Jest
  - Supertest for API testing
  - Test database isolation
  - Coverage reporting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Documentation**: Swagger UI
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd workcity-assessment-backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=add the allowed origin e.g localhost3000


# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/workcity-assessment

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h
```

###3. Database Setup

Ensure MongoDB is running locally, or update `MONGODB_URI` to point to your MongoDB instance.

### 4. Start the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:300`

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Test Database

Tests use a separate test database (`workcity-test`) to avoid affecting development data.

### Test Structure

- `tests/client.test.js` - Client API endpoint tests
- `tests/project.test.js` - Project API endpoint tests
- `tests/setup.js` - Test environment configuration

## 📚 API Documentation

### Interactive Documentation

Access the complete API documentation at: **http://localhost:300docs**

### Health Check

- **GET** `/health` - Server status and health information

### Authentication Endpoints

- **POST** `/api/auth/signup` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile` - Get user profile (protected)

### Client Management (Protected)

- **GET** `/api/clients` - Get all clients (admin + user)
- **POST** `/api/clients` - Create new client (admin only)
- **GET** `/api/clients/:id` - Get client by ID (admin + user)
- **PUT** `/api/clients/:id` - Update client (admin only)
- **DELETE** `/api/clients/:id` - Delete client (admin only)

### Project Management (Protected)

- **GET** `/api/projects` - Get all projects (admin + user)
- **POST** `/api/projects` - Create new project (admin only)
- **GET** `/api/projects/:id` - Get project by ID (admin + user)
- **PUT** `/api/projects/:id` - Update project (admin only)
- **DELETE** `/api/projects/:id` - Delete project (admin only)

## 🔐 Authentication

### JWT Token Usage

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **admin**: Full access to all operations
- **user**: Read-only access to clients and projects

## 📁 Project Structure

```
workcity-assessment-backend/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── config/
│   └── db.js            # MongoDB connection
├── controllers/          # Route controllers
│   ├── auth.controller.js
│   ├── client.controller.js
│   └── project.controller.js
├── middleware/           # Custom middleware
│   ├── auth.middleware.js
│   └── role.middleware.js
├── models/              # Mongoose models
│   ├── user.model.js
│   ├── client.model.js
│   └── project.model.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── client.routes.js
│   └── project.routes.js
├── swagger/             # API documentation
│   └── swagger.json
├── tests/               # Test files
│   ├── setup.js
│   ├── client.test.js
│   └── project.test.js
├── utils/               # Utility functions
│   └── validator.js
├── jest.config.js       # Jest configuration
├── package.json
└── README.md
```

## 🔧 Environment Variables

| Variable      | Description               | Default     | Required |
| ------------- | ------------------------- | ----------- | -------- |
| `PORT`        | Server port               | 30          | No       |
| `NODE_ENV`    | Environment mode          | development | No       |
| `MONGODB_URI` | MongoDB connection string | -           | Yes      |
| `JWT_SECRET`  | JWT signing secret        | -           | Yes      |
| `JWT_EXPIRE`  | JWT expiration time       | 24          |

## 🚀 Deployment

### Production Setup1ODE_ENV=production`

2 Use a strong `JWT_SECRET` 3. Configure production MongoDB
4Set up proper CORS origins
5vironment-specific variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 🆘 Support

For support and questions:

- Check the API documentation at `/api-docs`

const Joi = require("joi");

// Auth validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Client validation schemas
const clientSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Client name cannot be empty",
    "string.min": "Client name must be at least 1 character long",
    "string.max": "Client name cannot be more than 100 characters",
    "any.required": "Client name is required",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[\+]?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Please provide a valid phone number (7-15 digits, optionally starting with +)",
      "any.required": "Phone number is required",
    }),
});

// Project validation schemas
const projectSchema = Joi.object({
  title: Joi.string().trim().min(1).max(150).required().messages({
    "string.empty": "Project title cannot be empty",
    "string.min": "Project title must be at least 1 character long",
    "string.max": "Project title cannot be more than 150 characters",
    "any.required": "Project title is required",
  }),
  description: Joi.string().trim().max(1000).allow("").optional().messages({
    "string.max": "Description cannot be more than 1000 characters",
  }),
  status: Joi.string()
    .valid("pending", "in progress", "completed")
    .default("pending")
    .messages({
      "any.only": "Status must be one of: pending, in progress, completed",
    }),
  deadline: Joi.date().greater("now").required().messages({
    "date.greater": "Deadline must be a future date",
    "any.required": "Deadline is required",
  }),
  clientId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Client ID must be a valid MongoDB ObjectId",
    "string.length": "Client ID must be 24 characters long",
    "any.required": "Client ID is required",
  }),
});

// Partial schemas for updates (all fields optional)
const clientUpdateSchema = clientSchema.fork(
  ["name", "email", "phone"],
  (schema) => schema.optional()
);
const projectUpdateSchema = projectSchema.fork(
  ["title", "description", "status", "deadline", "clientId"],
  (schema) => schema.optional()
);

// Validation middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessages,
      });
    }
    req.body = value;
    next();
  };
};

module.exports = {
  // Auth validations
  validateSignup: validate(signupSchema),
  validateLogin: validate(loginSchema),

  // Client validations
  validateClient: validate(clientSchema),
  validateClientUpdate: validate(clientUpdateSchema),

  // Project validations
  validateProject: validate(projectSchema),
  validateProjectUpdate: validate(projectUpdateSchema),

  // Schemas for testing or other uses
  schemas: {
    signup: signupSchema,
    login: loginSchema,
    client: clientSchema,
    clientUpdate: clientUpdateSchema,
    project: projectSchema,
    projectUpdate: projectUpdateSchema,
  },
};

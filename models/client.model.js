const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[0-9]{7,15}$/, "Please enter a valid phone number"],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for email to improve query performance
clientSchema.index({ email: 1 });

// Virtual for getting client's projects
clientSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "clientId",
});

// Ensure virtual fields are serialized
clientSchema.set("toJSON", { virtuals: true });
clientSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Client", clientSchema);

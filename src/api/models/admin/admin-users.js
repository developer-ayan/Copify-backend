const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const AutoIncrement = require("mongoose-sequence")(mongoose);


const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please provide a valid email address",
      },
    },
    user_id: { type: Number, unique: true },
    token: { type: String },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the userSchema
adminUserSchema.plugin(AutoIncrement, { inc_field: "user_id" });

// Pre-save middleware to hash the password
adminUserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (error) {
        return next(error);
      }
    }
    next();
  });

const AdminUsers = mongoose.model("admin_users", adminUserSchema);

module.exports = AdminUsers;

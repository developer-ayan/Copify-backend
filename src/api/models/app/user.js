const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { riderAccountStatus } = require("../../../utils/static-values");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
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
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    notification_token: {
      type: String,
      default: null
    },
    role_id: {
      type: String,
      required: [true, "Role id is required"],
      trim: true,
    },
    institute_id: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
    },
    account_status: {
      type: String,
      default: "active",
    },
    contact_number: {
      type: String,
    },
    rider_status_for_student: {
      type: String,
      default: riderAccountStatus.in_active,
    },
    semester_id: {
      type: String,
      trim: true,
    },
    department_id: {
      type: String,
      trim: true,
    },
    year_level: {
      type: String,
      trim: true,
    },
    branch_address: {
      type: String,
      trim: true,
    },
    file_upload: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      name: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin with a unique counter name
userSchema.plugin(AutoIncrement, { inc_field: "user_id", id: "user_seq" });

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.index({ location: '2dsphere' });

const Users =
  mongoose.models.app_users || mongoose.model("app_users", userSchema);

module.exports = Users;

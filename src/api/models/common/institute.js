const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const instituteSchema = new mongoose.Schema(
  {
    user_id: { type: Number },
    institute_name: {
      type: String,
      required: [true, "institute name is required"],
      trim: true,
    },
    institute_location: {
      type: String,
      required: [true, "institute location is required"],
      trim: true,
    },
    file_upload: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the userSchema
instituteSchema.plugin(AutoIncrement, { inc_field: "institute_id" });

const Institute = mongoose.model("institute_list", instituteSchema);

module.exports = Institute;

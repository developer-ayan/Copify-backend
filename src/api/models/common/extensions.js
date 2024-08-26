const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Define the schema with required fields
const extensionSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    file_upload: {
      type: String,
      required: [true, "subject file is required"],
      trim: true,
    },
    extension_name: {
      type: String,
      required: [true, "Extension name is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the promoCodeSchema
extensionSchema.plugin(AutoIncrement, { inc_field: "extension_id" });

// Create and export the PromoCodes model
const Extensions = mongoose.model("extensions", extensionSchema);

module.exports = Extensions;

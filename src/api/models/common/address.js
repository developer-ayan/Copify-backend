const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const addressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    contact_number: {
      type: String,
      required: [true, "contact_number is required"],
      trim: true,
    },
    default_select: {
      type: Boolean,
    },
    user_id: {
      type: String,
      required: [true, "user id is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the userSchema
addressSchema.plugin(AutoIncrement, { inc_field: "address_id" });

const Address = mongoose.model("addresses", addressSchema);

module.exports = Address;

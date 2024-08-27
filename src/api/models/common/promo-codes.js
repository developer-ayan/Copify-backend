const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Define the schema with required fields
const promoCodeSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    start_date: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end_date: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          // 'this' refers to the current document being validated
          return value > this.start_date;
        },
        message: "End date must be at least one day after the start date",
      },
    },
    discount: {
      type: String,
      required: [true, "Discount is required"],
      trim: true,
    },
    promo_code: {
      type: String,
      required: [true, "Promo code is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the promoCodeSchema
promoCodeSchema.plugin(AutoIncrement, { inc_field: "promo_code_id" });

// Create and export the PromoCodes model
const PromoCodes = mongoose.model("promo_codes", promoCodeSchema);

module.exports = PromoCodes;

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Define the schema with required fields
const pointSchema = new mongoose.Schema(
    {
        user_id: { type: Number, required: true },
        points: {
            type: Number,
            required: [true, "points is required"],
            trim: true,
        },
        php: {
            type: Number,
            required: [true, "php is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the promoCodeSchema
pointSchema.plugin(AutoIncrement, { inc_field: "point_into_php_id" });

// Create and export the PromoCodes model
const PointIntoPhp = mongoose.model("point_into_php", pointSchema);

module.exports = PointIntoPhp;

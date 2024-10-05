const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const riderActivationSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        activation_time: {
            type: String,
            required: [true, "activation_time is required"],
            trim: true,
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
riderActivationSchema.plugin(AutoIncrement, { inc_field: "rider_activation_id" });

const RiderActivation = mongoose.model("rider_activations", riderActivationSchema);

module.exports = RiderActivation;

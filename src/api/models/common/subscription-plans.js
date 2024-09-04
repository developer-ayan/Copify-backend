const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Define the schema with required fields
const subscriptionPlanSchema = new mongoose.Schema(
    {
        user_id: { type: Number, required: true },
        price: {
            type: Number,
            required: [true, "price is required"],
            trim: true,
        },
        month: {
            type: String,
            required: [true, "Month is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the promoCodeSchema
subscriptionPlanSchema.plugin(AutoIncrement, { inc_field: "subsrciption_plan_id" });

// Create and export the PromoCodes model
const SubscriptionPlan = mongoose.model("subsrciption_plans", subscriptionPlanSchema);

module.exports = SubscriptionPlan;

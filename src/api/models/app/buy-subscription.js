const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const buySubsciptionSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            required: [true, "user_id is required"],
            trim: true,
        },
        subsrciption_plan_id: {
            type: Number,
            required: [true, "subsrciption_plan_id is required"],
            trim: true,
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
buySubsciptionSchema.plugin(AutoIncrement, { inc_field: "buy_subscription_id" });

const BuySubscription = mongoose.model("buy_subscription", buySubsciptionSchema);

module.exports = BuySubscription;

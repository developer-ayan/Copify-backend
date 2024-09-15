const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const topUpSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: [true, "user_id is required"],
            trim: true,
        },
        amount: {
            type: String,
            required: [true, "amount is required"],
            trim: true,
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
topUpSchema.plugin(AutoIncrement, { inc_field: "wallet_id" });

const Wallet = mongoose.model("wallets", topUpSchema);

module.exports = Wallet;

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const transactionSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: [true, "user_id is required"],
            trim: true,
        },
        transaction_ref_id: {
            type: String,
            required: [true, "transaction_ref_id is required"],
            trim: true,
        },
        transaction_reason: {
            type: String,
            required: [true, "transaction_reason is required"],
            trim: true,
        },
        transaction_type: {
            type: String,
            required: [true, "transaction_type is required"],
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
transactionSchema.plugin(AutoIncrement, { inc_field: "transaction_id" });

const Transaction = mongoose.model("transactions", transactionSchema);

module.exports = Transaction;

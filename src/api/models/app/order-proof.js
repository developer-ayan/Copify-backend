const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderProofSchema = new mongoose.Schema(
    {
        order_id: {
            type: Number,
            required: [true, "order_id is required"],
            trim: true,
        },
        user_id: {
            type: String,
            required: [true, "user_id is required"],
            trim: true,
        },
        file_uploads: {
            type: Array,
            required: [true, "file_uploads is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
orderProofSchema.plugin(AutoIncrement, { inc_field: "order_proof" });

const OrderProof = mongoose.model("order_proof", orderProofSchema);

module.exports = OrderProof;

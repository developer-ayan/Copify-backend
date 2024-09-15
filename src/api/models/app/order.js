const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: [true, "user_id is required"],
            trim: true,
        },
        rider_id: {
            type: String,
            trim: true,
        },
        self_pickup: {
            type: String,
            trim: true,
        },
        address_id: {
            type: String,
            trim: true,
        },
        shop_id: {
            type: String,
            trim: true,
        },
        subject_file_ids: {
            type: String,
            required: [true, "subject_file_ids is required"],
            trim: true,
        },
        rider_charges: {
            type: String,
            required: [true, "rider_charges is required"],
            trim: true,
        },
        sub_total: {
            type: String,
            required: [true, "sub_total is required"],
            trim: true,
        },
        total_price: {
            type: String,
            required: [true, "total_price is required"],
            trim: true,
        },
        order_status: {
            type: String,
            required: [true, "order_status is required"],
            trim: true,
        },
        transaction_id: {
            type: String,
            required: [true, "transaction_id is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
orderSchema.plugin(AutoIncrement, { inc_field: "order_id" });

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;

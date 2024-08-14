const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const deliveryChargesSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        delivery_charges: {
            type: Number,
            required: [true, "delivery charges is required"],
            trim: true,
        }
    }
);


const DeliveryCharges = mongoose.model("delivery_charges", deliveryChargesSchema);

module.exports = DeliveryCharges;

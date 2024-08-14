const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const riderRadiusSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        rider_radius: {
            type: String,
            required: [true, "rider radius is required"],
            trim: true,
        }
    }
);

// Apply the autoIncrement plugin to the userSchema
riderRadiusSchema.plugin(AutoIncrement, { inc_field: "rider_radius_id" });

const RiderRadius = mongoose.model("rider_radius", riderRadiusSchema);

module.exports = RiderRadius;

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: Number },
    heading: {
      type: String,
      required: [true, "heading is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "message is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the userSchema
notificationSchema.plugin(AutoIncrement, { inc_field: "notification_id" });

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;

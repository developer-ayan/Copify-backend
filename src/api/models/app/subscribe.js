const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subscribeSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: Number,
      required: [true, "teacher_id is required"],
      trim: true,
    },
    user_id: {
      type: Number,
      required: [true, "user_id is required"],
      trim: true,
    },
    subject_id: {
      type: Number,
      required: [true, "subject_id is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Apply the autoIncrement plugin to the userSchema
subscribeSchema.plugin(AutoIncrement, { inc_field: "subscribe_id" });

const Subscribes = mongoose.model("subscribes", subscribeSchema);

module.exports = Subscribes;

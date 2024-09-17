const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const chatSchema = new mongoose.Schema(
    {
        messages: {
            type: String,
            trim: true,
            default: ""
        },
        last_message: {
            type: String,
            trim: true,
            default: ""
        },
        user_id_1: {
            type: String,
            trim: true,
        },
        user_id_2: {
            type: String,
            trim: true,
        },
        room_id: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
chatSchema.plugin(AutoIncrement, { inc_field: "chat_id" });

const Chat = mongoose.model("chats", chatSchema);

module.exports = Chat;

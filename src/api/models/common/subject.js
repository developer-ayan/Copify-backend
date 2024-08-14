const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subjectSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        institute_id: { type: Number },
        subject_name: {
            type: String,
            required: [true, "subject name is required"],
            trim: true,
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
subjectSchema.plugin(AutoIncrement, { inc_field: "institute_subject_id" });

const Subject = mongoose.model("subject_list", subjectSchema);

module.exports = Subject;

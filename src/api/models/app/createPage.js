const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subjectSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        department_id: {
            type: String,
            required: [true, "department id is required"],
            trim: true,
        },
        section: {
            type: String,
            required: [true, "section is required"],
            trim: true,
        },
        subject_code: {
            type: String,
            required: [true, "subject code is required"],
            trim: true,
        },
        subject_description: {
            type: String,
            required: [true, "subject description is required"],
            trim: true,
        },
        semester_id: {
            type: String,
            required: [true, "semester id is required"],
            trim: true,
        },
        year: {
            type: String,
            required: [true, "year is required"],
            trim: true,
        },
        no_of_enrolled: {
            type: String,
            required: [true, "no of enrolled is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
subjectSchema.plugin(AutoIncrement, { inc_field: "subject_id" });

const Subject = mongoose.model("subjects", subjectSchema);

module.exports = Subject;

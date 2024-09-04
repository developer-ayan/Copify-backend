const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subjectFileSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: [true, "user id is required"],
            trim: true,
        },
        subject_id: {
            type: String,
            required: [true, "subject id is required"],
            trim: true,
        },
        file_upload: {
            type: String,
            required: [true, "subject file is required"],
            trim: true,
        },
        title: {
            type: String,
            required: [true, "title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "description is required"],
            trim: true,
        },
        page_number: {
            type: String,
            required: [true, "page number is required"],
            trim: true,
        },
        paper_size_id: {
            type: String,
            required: [true, "page size id is required"],
            trim: true,
        },
        color_code_id: {
            type: String,
            required: [true, "color code is required"],
            trim: true,
        },
        total_price: {
            type: String,
            required: [true, "total price is required"],
            trim: true,
        },
        publish_or_save: {
            type: String,
            required: [true, "publish or save is required"],
            trim: true,
        },
        time: {
            type: String,
            trim: true,
        }, 
        date: {
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
subjectFileSchema.plugin(AutoIncrement, { inc_field: "subject_file_id" });

const SubjectFiles = mongoose.model("subject_files", subjectFileSchema);

module.exports = SubjectFiles;

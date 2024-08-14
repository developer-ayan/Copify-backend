const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const departmentSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        institute_id: { type: Number },
        department_name: {
            type: String,
            required: [true, "department name is required"],
            trim: true,
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);

// Apply the autoIncrement plugin to the userSchema
departmentSchema.plugin(AutoIncrement, { inc_field: "department_id" });

const Department = mongoose.model("department_list", departmentSchema);

module.exports = Department;

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const semesterSchema = new mongoose.Schema({
  user_id: { type: Number },
  semester_name: {
    type: String,
    required: [true, "Semester name is required"],
    trim: true,
  },
  department_id: {
    type: String,
    required: [true, "Department id is required"],
    trim: true,
  },
});

// Apply the autoIncrement plugin to the userSchema
semesterSchema.plugin(AutoIncrement, { inc_field: "semester_id" });

const Semesters = mongoose.model("semesters", semesterSchema);

module.exports = Semesters;

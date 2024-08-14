const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const paperSizeSchema = new mongoose.Schema(
    {
        user_id: { type: Number },
        paper_size: {
            type: String,
            required: [true, "paper size is required"],
            trim: true,
        }
    }
);

// Apply the autoIncrement plugin to the userSchema
paperSizeSchema.plugin(AutoIncrement, { inc_field: "paper_size_id" });

const PaperSizes = mongoose.model("paper_sizes", paperSizeSchema);

module.exports = PaperSizes;

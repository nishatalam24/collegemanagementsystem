const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      // unique: true, // Ensure codes are unique across all entries
    },
    enrollmentNo: {
      type: Number, // Reference to the student's MongoDB ID
      required: true,
    },
programName:{
  type: String,
  required: true,
}
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Code", codeSchema);

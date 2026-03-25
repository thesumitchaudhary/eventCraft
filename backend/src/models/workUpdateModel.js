const mongoose = require("mongoose");

const workUpdateSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignTask",
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    note: String,

    // ✅ AWS-based evidence
    evidence: {
      key: String,
      fileName: String,
      contentType: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkUpdate", workUpdateSchema);
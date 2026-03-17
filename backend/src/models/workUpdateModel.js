import mongoose from "mongoose";

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

    note: {
      type: String,
    },

    evidence: {
      type: String, // file URL
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WorkUpdate", workUpdateSchema);
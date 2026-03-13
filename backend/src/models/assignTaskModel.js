import mongoose from "mongoose";

const assignTaskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    // required: true
  },

  taskDescription: {
    type: String
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    // required: true
  },

  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "medium"
  },

  selectedDate: {
    type: Date,
    // required: true
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("AssignTask", assignTaskSchema);
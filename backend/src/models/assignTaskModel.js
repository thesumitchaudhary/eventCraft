import mongoose from "mongoose";

const assignTaskSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventBooking",
    required: true,
  },
  taskTitle: { type: String, required: true, trim: true },
  taskDescription: { type: String, required: true, trim: true },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // must store Employee._id here
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  selectDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("AssignTask", assignTaskSchema);
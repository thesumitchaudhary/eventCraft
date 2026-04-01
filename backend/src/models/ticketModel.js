import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "active", "escalated", "resolved"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderRole: {
    type: String,
    enum: ["customer", "employee", "admin"]
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
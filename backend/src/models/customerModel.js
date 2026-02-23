import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventBooking",
    }],
    phone: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);

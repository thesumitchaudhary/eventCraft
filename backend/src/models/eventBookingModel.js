import mongoose from "mongoose";
// import validation from "validator"

const eventBookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    eventName: {
      type: String,
    //   required: true,
    },

    eventType: {
      type: String,
    //   required: true,
    },

    theme: {
      type: String,
    },

    eventDate: {
      type: Date,
    //   required: true,
    },

    venue: {
      type: String,
    //   required: true,
    },

    guestCount: {
      type: Number,
    //   required: true,
    //   min: 1,
    },

    totalAmount: {
      type: Number,
    //   required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      enum: ["requested", "confirmed", "cancelled", "completed"],
      default: "requested",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventBooking", eventBookingSchema);

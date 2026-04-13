import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventBooking",
        required: true
    },

    paymentAmount: {
        type: Number,
        required: true
    },

    cardDetails: {
        cardNumber: {
            type: String,
            match: /^[0-9]{12,16}$/
        },

        expiryMonth: {
            type: Number,
            min: 1,
            max: 12
        },

        expiryYear: {
            type: Number
        },

        cvv: {
            type: String,
            match: /^[0-9]{3,4}$/
        }
    },

    razorpayOrderId: {
        type: String
    },

    razorpayPaymentId: {
        type: String
    },

    razorpaySignature: {
        type: String
    },

    paymentMethod: {
        type: String,
        enum: [
            "credit card",
            "debit card",
            "upi",
            "net banking",
            "wallet",
            "cash on delivery",
            "paypal",
            "razorpay"
        ],
        default: "razorpay"
    },

    status: {
        type: String,
        enum: ["success", "failed", "pending"],
        default: "pending"
    },

    paidAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Payment", PaymentSchema);
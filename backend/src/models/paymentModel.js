import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    paymentAmount: {
        type: Number,
        required: true
    },

    cardDetails: {
        cardNumber: {
            type: String,
            required: true,
            match: /^[0-9]{12,16}$/ // allows common card lengths
        },

        expiryMonth: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },

        expiryYear: {
            type: Number,
            required: true
        },

        cvv: {
            type: String,
            required: true,
            match: /^[0-9]{3,4}$/
        }
    },

    paymentMethod: {
        type: String,
        enum: ["card"],
        default: "card"
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
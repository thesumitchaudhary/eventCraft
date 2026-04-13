import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";
import eventBookingModel from "../models/eventBookingModel.js";
import paymentModel from "../models/paymentModel.js";


const KEY_ID = process.env.KEY_ID;
const KEY_SECRET = process.env.KEY_SECRET;

const razorpay = KEY_ID && KEY_SECRET
    ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
    : null;

function getReadableErrorMessage(error, fallback) {
    return (
        error?.message ||
        error?.error?.description ||
        error?.error?.reason ||
        error?.error?.code ||
        fallback
    );
}

function parseAmount(rawAmount) {
    const amount = Number(String(rawAmount).replace(/[^0-9.]/g, ""));
    return Number.isFinite(amount) ? amount : 0;
}

async function getAlreadyPaid(bookingId) {
    const previousPayment = await paymentModel.aggregate([
        {
            $match: {
                bookingId: new mongoose.Types.ObjectId(bookingId),
                status: "success",
            },
        },
        {
            $group: {
                _id: "$bookingId",
                totalPaid: { $sum: "$paymentAmount" },
            },
        },
    ]);

    return previousPayment[0]?.totalPaid || 0;
}

export const createRazorpayOrder = async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(500).json({
                success: false,
                message: "Razorpay keys are missing in environment",
            });
        }

        const { bookingId, paymentAmount } = req.body;

        const booking = await eventBookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const amount = parseAmount(paymentAmount);
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid paymentAmount is required" });
        }

        const alreadyPaid = await getAlreadyPaid(bookingId);
        const pendingAmount = Number(booking.totalAmount || 0) - alreadyPaid;

        if (pendingAmount <= 0) {
            return res.status(400).json({ success: false, message: "Booking is already fully paid" });
        }

        if (amount > pendingAmount) {
            return res.status(400).json({
                success: false,
                message: `Payment cannot exceed pending amount (${pendingAmount})`,
            });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `bk_${String(bookingId).slice(-12)}_${Date.now().toString().slice(-10)}`,
            notes: {
                bookingId: String(bookingId),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Razorpay order created",
            data: {
                key: KEY_ID,
                order,
                bookingId,
                paymentAmount: amount,
                pendingAmount,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: getReadableErrorMessage(error, "Unable to create Razorpay order"),
        });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        if (!KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Razorpay key secret is missing in environment",
            });
        }

        const {
            bookingId,
            paymentAmount,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentMethod,
        } = req.body;

        const booking = await eventBookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Razorpay verification fields are required" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
        }

        const amount = parseAmount(paymentAmount);
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid paymentAmount is required" });
        }

        const alreadyPaid = await getAlreadyPaid(bookingId);
        const totalPaid = alreadyPaid + amount;

        if (totalPaid > Number(booking.totalAmount || 0)) {
            return res.status(400).json({
                success: false,
                message: "Payment exceeds the remaining booking amount",
            });
        }

        const makePayment = await paymentModel.create({
            bookingId,
            paymentAmount: amount,
            paymentMethod: paymentMethod || "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: "success",
        });

        await eventBookingModel.findByIdAndUpdate(
            bookingId,
            {
                paymentStatus: totalPaid >= Number(booking.totalAmount || 0) ? "paid" : "pending",
            },
            { new: true }
        );

        return res
            .status(201)
            .json({ success: true, message: "Payment verified successfully", data: makePayment });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: getReadableErrorMessage(error, "Unable to verify payment"),
        });
    }
};
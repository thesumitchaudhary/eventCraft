import mongoose from "mongoose";
import eventBookingModel from "../models/eventBookingModel.js";
import paymentModel from "../models/paymentModel.js";


export const Payment = async (req, res) => {
    try {
        const { bookingId, paymentAmount, cardDetails } = req.body;

        const booking = await eventBookingModel.findById(bookingId);
        if (!booking) {
            return res.status(400).json({ success: false, message: "bookingId is required" });
        }

        const amount = Number(String(paymentAmount).replace(/[^0-9.]/g, ""));
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid paymentAmount is required" });
        }

        const previousPayment = await paymentModel.aggregate([
            {
                $match: {
                    bookingId: new mongoose.Schema.Types.ObjectId(bookingId)
                }
            },
            {
                $group: {
                    _id: "$bookingId",
                    totalPaid: { $sum: "$paymentAmount" }
                }
            }
        ]);

        const aleardyPaid = previousPayment[0]?.totalPaid || 0;

        const currentPayment = Number(paymentAmount);

        const totalPaid = aleardyPaid + currentPayment;

        let paymentStatus = "partial";

        if (totalPaid >= booking.totalAmount) {
            paymentStatus = "paid"
        }

        const makePayment = await paymentModel.create({
            bookingId,
            paymentAmount: amount,
            cardDetails, // do not store raw card data in production
            status: "success",
        });

        await eventBookingModel.findByIdAndUpdate(bookingId, {
            paymentStatus: paymentStatus,
        });

        return res
            .status(201)
            .json({ success: true, message: "Payment Successful", data: makePayment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
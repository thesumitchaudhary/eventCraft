import mongoose from "mongoose";
import customerModel from "../models/customerModel.js"
import eventBookingModel from "../models/eventBookingModel.js"

// import eventbook mail funtion
import { SendEventBookingMail } from "../helpers/sendMail.js";


export const createEvent =  async (req, res) => {
    try {
        const userId = req.user.id;
        const userFirstname = req.user.firstname;
        const userLastname = req.user.lastname;

        const { eventName, eventType, theme, eventDate, venue, guestCount, totalAmount } = req.body;
        const customer = await customerModel.findOne({ userId });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const eventBooked = await eventBookingModel.create({
            customerId: customer._id,
            eventName,
            eventType,
            theme,
            eventDate,
            venue,
            guestCount,
            totalAmount
        });

        await customerModel.updateOne(
            { _id: customer._id },
            { $push: { events: eventBooked._id } }
        );

        await SendEventBookingMail(
            req.user.email,
            req.user.firstname,
            req.user.lastname,
            eventBooked.eventType,
            eventBooked.theme,
            eventBooked.eventDate,
            eventBooked.guestCount,
            eventBooked.totalAmount,
            eventBooked.paymentStatus,
            eventBooked.bookingStatus
        )

        res.status(201).json({
            success: true,
            data: eventBooked
        });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Error" });
    }
}
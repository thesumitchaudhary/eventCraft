import express from "express";

// this is for the create protected route
import isLoggedin from "../Middleware/isLoggedin.js"
import authMiddleware from "../Middleware/authMiddleware.js"

// this is for import the collection file
import customerModel from "../models/customerModel.js";
import eventBookingModel from "../models/eventBookingModel.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey it's working fine");
})

router.get("/my-bookings", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const customer = await customerModel.findOne({ userId }).populate("events");

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({
            success: true,
            data: customer.events,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/createEvent", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventName, eventType, theme, eventDate, venue, guestCount, totalAmount } = req.body;

        const customer = await customerModel.findOne({ userId });
        if (!user) {
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
            { _id: user._id },
            { $push: { events: eventBooked._id } }
        );
        // user.events.push(eventBooked._id)
        // await user.save()

        res.status(201).json({
            success: true,
            data: eventBooked
        });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Error" });
    }
});
export default router
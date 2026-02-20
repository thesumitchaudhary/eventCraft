import express from "express";

// this is for the create protected route
import isLoggedin from "../Middleware/isLoggedin.js"
import authMiddleware from "../Middleware/authMiddleware.js"

// this is for import the collection file
import eventBookingModel from "../models/eventBookingModel.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey it's working fine");
})

router.get("/my-bookings", authMiddleware, async (req, res) => {
    try {
        const customerId = req.user.id;
        const bookings = await eventBookingModel.find({ userId: customerId }).populate("userId", "firstname lastname email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.post("/createEvent", async (req, res) => {
    try {
        const { eventName, eventType, theme, eventDate, venue, guestCount, totalAmount } = req.body;
        const eventBooked = await eventBookingModel.create({
            eventName,
            eventType,
            theme,
            eventDate,
            venue,
            guestCount,
            totalAmount
        })
        res.json({ message: eventBooked })
    } catch (error) {
        res.json(error)
    }
})

export default router
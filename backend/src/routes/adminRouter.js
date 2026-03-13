import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// import admin model
import userModel from "../models/userModel.js";

// import eventbooking model
import eventBookingModel from "../models/eventBookingModel.js";

// import customer model
import customerModel from "../models/customerModel.js";

// import  event Theme model
import eventThemeModel from "../models/eventThemeModel.js";

// import assignTask model
import assignTaskModel from "../models/assignTaskModel.js"

// import middleware for protecting routes
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey this is admin Router")
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email: email.trim() });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // optional: enforce admin-only login on this route
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // fixed typo

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            message: "Admin login successful",
            role: user.role
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

// this is for task section

router.post("/createTask", async (req, res) => {
    try {
        const { selectedEventId, taskTile, description, assginTo, priority, selectDate } = req.body;
        const assignTask = await assignTaskModel.create({
            eventId: selectedEventId,
            taskTile,
            description,
            assginTo,
            priority,
            selectDate
        });

        res.json({ assignTask })
    }
    catch (error) {
        res.json({ message: error.message })
    }
})

// this is all routes for eventbook action

// this is for admin to show booked event by the customer

router.get("/showBookedEvent", authMiddleware, async (req, res) => {
    try {
        const customers = await customerModel.find().populate("userId", "firstname lastname email role").populate("events");

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: "no booked events found" });
        }

        return res.status(200).json({ customers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.put("/updateStatus/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { bookingStatus } = req.body;
        const id = req.params.id;

        const eventBookStatusAction = await eventBookingModel.findByIdAndUpdate(
            id,
            {
                bookingStatus
            },
        )

        res.json(eventBookStatusAction)
    }
    catch (error) {
        res.json(error);
    }
})

// this is all routes for the eventtheme

router.get("/getAllEventTheme", authMiddleware, async (req, res) => {
    try {
        const getEventThemes = await eventThemeModel.find();

        if (!getEventThemes) {
            res.json("there was not theme available")
        }

        res.json(getEventThemes);
    } catch (error) {
        res.json({ message: error })
    }
})

router.post("/addEventTheme", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { themeName, themeType, themePrice } = req.body;
        const eventThemeCreated = await eventThemeModel.create({
            themeName,
            themeType,
            themePrice
        })
        res.json(eventThemeCreated)
    }
    catch (error) {
        res.json({ message: error })
    }
})

router.delete("/deleteEventTheme/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await eventThemeModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Theme not found" });
        }
        res.json({ message: "Deleted successfully", deleted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/updateEventTheme/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { themeName, themeType, themePrice } = req.body;
        const { id } = req.params;

        const updatedTheme = await eventThemeModel.findByIdAndUpdate(
            id,
            {
                themeName,
                themeType,
                themePrice
            },
            { new: true }
        );

        if (!updatedTheme) {
            return res.status(400).json({ message: "Theme does not exist" });
        }

        res.status(200).json({
            message: "Theme is updated successfully",
            data: updatedTheme
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.json("hey the admin is logout successfully");
})

export default router
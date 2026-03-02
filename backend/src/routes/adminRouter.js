import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// import admin model
import adminModel from "../models/adminModel.js";

// import eventbooking model
import eventBookingModel from "../models/eventBookingModel.js";

// import  event Theme model
import eventThemeModel from "../models/eventThemeModel.js";

// import middleware for protecting routes
import authMiddleware from "../Middleware/authMiddleware.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey this is admin Router")
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            res.json({ message: "Something were wrong" });
        }

        bcrypt.compare(password, admin.passowrd, function (err, result) {
            if (result) {
                const token = jwt.sign({ email }, "shhhhhh");
                res.cookie("token", token);
                res.json({ message: "hey the admin is login successfully" })
            }
        });
    }
    catch (error) {
        res.json(error);
    }
})

// this is all routes for eventbook action

router.put("/updateStatus/:id", async (req, res) => {
    try {
        const { bookingStatus } = req.body;
        console.log(bookingStatus)
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

router.get("/getAllEventTheme", async (req, res) => {
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

router.post("/addEventTheme", async (req, res) => {
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

router.delete("/deleteEventTheme/:id", async (req, res) => {
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

router.put("/updateEventTheme/:id", async (req, res) => {
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
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//import models
import adminModel from "../models/adminModel.js";
import userModel from "../models/userModel.js";
import eventBookingModel from "../models/eventBookingModel.js";
import customerModel from "../models/customerModel.js";
import eventThemeModel from "../models/eventThemeModel.js";
import paymentModel from "../models/paymentModel.js";
import assignTaskModel from "../models/assignTaskModel.js";
import employeeModel from "../models/employeeModel.js";
import { deleteObject, getObjectURL, uploadObject } from "../config/s3.js";

// import middleware for protecting routes
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

// import admin login controller
import { adminLogin, adminLogout } from "../controllers/Auth.js";

// import all action controller and get event Themes
import { getAllThemes, addEventTheme, deleteEventTheme, updateEventTheme } from "../controllers/eventThemeController.js"

// import task controller for task create by admin and assign to employee
import {createTask} from "../controllers/taskController.js";

const router = express.Router();


router.get("/", (req, res) => {
    res.send("hey this is admin Router")
})

// for admin login
router.post("/login", adminLogin)
// for admin logout
router.get("/logout",adminLogout)

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const MIME_EXTENSION_MAP = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}


function parseBase64Image(dataUrl = "") {
    const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
        const error = new Error("Invalid image payload. Send a base64 data URL.");
        error.status = 400;
        throw error;
    }

    const [, mimeType, base64Data] = match;
    const extension = MIME_EXTENSION_MAP[mimeType.toLowerCase()];
    if (!extension) {
        const error = new Error("Unsupported image type. Use jpg, png, or webp.");
        error.status = 400;
        throw error;
    }

    const body = Buffer.from(base64Data, "base64");
    if (!body.length) {
        const error = new Error("Image payload is empty.");
        error.status = 400;
        throw error;
    }

    if (body.length > PROFILE_IMAGE_MAX_BYTES) {
        const error = new Error("Image is too large. Max size is 5MB.");
        error.status = 400;
        throw error;
    }

    return { mimeType, body, extension };
}

async function attachProfileImageUrl(adminDoc) {
    if (!adminDoc) return null;

    const admin = adminDoc.toObject();
    const profileImageKey = admin?.userId?.profileImage;
    if (!profileImageKey) return admin;

    try {
        // GET signed URL from S3
        admin.userId.profileImageUrl = await getObjectURL(profileImageKey);
    } catch (error) {
        console.error("Failed to create signed profile image URL", error);
        admin.userId.profileImageUrl = null;
    }

    return admin;
}




router.get("/me", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = req.user.id

        const adminDoc = await adminModel.findOne({ userId }).populate("userId");
        const admin = await attachProfileImageUrl(adminDoc);

        return res.status(200).json({
            message: "User fetched successfully",
            admin,
        });
    } catch (error) {
        console.error("/me error", error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.put("/user/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = String(req.user.id);
        const routeUserId = String(req.params.id).replace(/^:/, "");

        if (userId !== routeUserId) {
            return res.status(403).json({ message: "you can update your own profile only" });
        }

        const { firstname, lastname, phone, email, profileImage, removeProfileImage } = req.body;

        const existingUser = await userModel.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }

        const userUpdates = {};
        const adminUpdates = {};

        if (firstname !== undefined) userUpdates.firstname = firstname;
        if (lastname !== undefined) userUpdates.lastname = lastname;
        if (email !== undefined) userUpdates.email = email;

        if (phone !== undefined) adminUpdates.phone = phone;

        if (profileImage !== undefined && profileImage !== null && profileImage !== "") {
            const parsedImage = parseBase64Image(profileImage);
            const key = `profiles/admin/${userId}/${Date.now()}.${parsedImage.extension}`;

            await uploadObject(key, parsedImage.body, parsedImage.mimeType);
            userUpdates.profileImage = key;

            if (existingUser.profileImage) {
                await deleteObject(existingUser.profileImage).catch((error) => {
                    console.error("Failed to delete previous profile image", error);
                });
            }
        } else if (removeProfileImage === true) {
            if (existingUser.profileImage) {
                await deleteObject(existingUser.profileImage).catch((error) => {
                    console.error("Failed to delete previous profile image", error);
                });
            }
            userUpdates.profileImage = "";
        }


        if (!Object.keys(userUpdates).length && !Object.keys(adminUpdates).length) {
            return res.status(400).json({ message: "No field provided to update" });
        }

        if (userUpdates.email) {
            const existingEmailUser = await userModel.findOne({
                email: userUpdates.email,
                _id: { $ne: userId }
            });

            if (existingEmailUser) {
                return res.status(409).json({ message: "Email is already in use." });
            }
        }

        if (Object.keys(userUpdates).length) {
            await userModel.findByIdAndUpdate(
                userId,
                { $set: userUpdates },
                { new: true, runValidators: true }
            );
        }

        if (Object.keys(adminUpdates).length) {
            await adminModel.findOneAndUpdate(
                { userId },
                { $set: adminUpdates },
                { new: true, runValidators: true }
            );
        }

        const updatedAdmin = await adminModel
            .findOne({ userId })
            .populate({ path: "userId", select: "firstname lastname email role profileImage createdAt updatedAt" });

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin profile not found" });
        }

        return res.json({
            message: "Profile updated",
            admin: updatedAdmin
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});



// this is for task section

router.post("/createTask",authMiddleware, adminMiddleware, createTask);

// this is all routes for eventbook action

// this is for admin to show booked event by the customer

router.get("/showBookedEvent", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const customers = await customerModel.find().populate("userId", "firstname lastname email role").populate("events");

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: "no booked events found" });
        }

        // Extract all booking IDs from all customers
        const bookingIds = customers.flatMap(customer => customer.events.map(event => event._id));
            
        // Get payment information for all bookings
        const payments = await paymentModel.aggregate([
            {
                $match: {
                    bookingId: { $in: bookingIds }
                }
            },
            {
                $group: {
                    _id: "$bookingId",
                    totalPaid: { $sum: "$paymentAmount" }
                }
            }
        ]);

        // Create a map of bookingId -> totalPaid for easy lookup
        const paymentMap = {};
        payments.forEach(payment => {
            paymentMap[payment._id] = payment.totalPaid;
        });

        // Enrich customers with payment info
        const enrichedCustomers = customers.map(customer => ({
            ...customer.toObject(),
            events: customer.events.map(event => ({
                ...event.toObject(),
                totalPaid: paymentMap[event._id] || 0
            }))
        }));

        return res.status(200).json({ customers: enrichedCustomers });
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

router.get("/getAllEventTheme", authMiddleware, getAllThemes)
router.post("/addEventTheme", authMiddleware, adminMiddleware, addEventTheme)
router.delete("/deleteEventTheme/:id", authMiddleware, adminMiddleware, deleteEventTheme);
router.put("/updateEventTheme/:id", authMiddleware, adminMiddleware, updateEventTheme);



export default router
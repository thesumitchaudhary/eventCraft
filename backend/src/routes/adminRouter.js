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
import assignTaskModel from "../models/assignTaskModel.js";
import employeeModel from "../models/employeeModel.js";
import { deleteObject, getObjectURL, uploadObject } from "../config/s3.js";

// import middleware for protecting routes
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router = express.Router();

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


router.get("/", (req, res) => {
    res.send("hey this is admin Router")
})

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
        const {
            selectedEventId,
            eventId,
            taskTitle,
            taskDescription,
            assignTo,
            priority,
            selectDate,
        } = req.body;

        const finalEventId = selectedEventId || eventId;

        if (!finalEventId || !taskTitle || !taskDescription || !assignTo || !selectDate) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        if (!mongoose.isValidObjectId(finalEventId) || !mongoose.isValidObjectId(assignTo)) {
            return res.status(400).json({ message: "Invalid eventId or assignTo" });
        }

        const eventExists = await eventBookingModel.exists({ _id: finalEventId });
        if (!eventExists) {
            return res.status(404).json({ message: "Event not found" });
        }

        // accept Employee._id first
        let employee = await employeeModel.findById(assignTo).select("_id userId");

        // fallback: if frontend sent User._id, map it to Employee._id
        if (!employee) {
            employee = await employeeModel.findOne({ userId: assignTo }).select("_id userId");
        }

        if (!employee) {
            return res.status(400).json({ message: "assignTo must be a valid Employee/User id linked to Employee" });
        }

        const assignTask = await assignTaskModel.create({
            eventId: finalEventId,
            taskTitle: taskTitle.trim(),
            taskDescription: taskDescription.trim(),
            assignTo: employee._id, // always store Employee._id
            priority,
            selectDate,
        });

        await employeeModel.findOneAndUpdate(
            employee._id,
            { $push: { tasks: assignTask._id } },
            { new: true }
        );
        return res.status(201).json({ assignTask });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// this is all routes for eventbook action

// this is for admin to show booked event by the customer

router.get("/showBookedEvent", authMiddleware, adminMiddleware, async (req, res) => {
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
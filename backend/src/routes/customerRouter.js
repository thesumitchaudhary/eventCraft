import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { register, verifyEmail, login, logout } from "../controllers/Auth.js"

// import authmiddleware for show user
import authMiddleware from "../Middleware/authMiddleware.js";

// import Models
import userModel from "../models/userModel.js";
import customerModel from "../models/customerModel.js";
import { deleteObject, getObjectURL, uploadObject } from "../config/s3.js";


const router = express.Router();

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const MIME_EXTENSION_MAP = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

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

async function attachProfileImageUrl(customerDoc) {
    if (!customerDoc) return null;

    const customer = customerDoc.toObject();
    const profileImageKey = customer?.userId?.profileImage;
    if (!profileImageKey) return customer;

    try {
        customer.userId.profileImageUrl = await getObjectURL(profileImageKey);
    } catch (error) {
        console.error("Failed to create signed profile image URL", error);
        customer.userId.profileImageUrl = null;
    }

    return customer;
}

router.get("/", (req, res) => {
    res.send("hey the customer routes is working");
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id

        const customerDoc = await customerModel.findOne({ userId }).populate("userId");
        const customer = await attachProfileImageUrl(customerDoc);

        return res.status(200).json({
            message: "User fetched successfully",
            customer,
        });
    } catch (error) {
        console.error("/me error", error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/create", register);

router.post("/verifyEmail", verifyEmail);

router.post("/login", login);

router.put("/user/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const routeUserId = req.params.id;

        if (routeUserId !== userId) {
            return res.status(403).json({ message: "You can update only your own profile" });
        }

        const { firstname, lastname, email, phone, address, profileImage, removeProfileImage } = req.body;

        const existingUser = await userModel.findById(userId).select("profileImage");
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userUpdates = {};
        const customerUpdates = {};

        if (firstname !== undefined) userUpdates.firstname = firstname;
        if (lastname !== undefined) userUpdates.lastname = lastname;
        if (email !== undefined) userUpdates.email = email;

        if (phone !== undefined) customerUpdates.phone = phone;
        if (address !== undefined) customerUpdates.address = address;

        if (profileImage !== undefined && profileImage !== null && profileImage !== "") {
            const parsedImage = parseBase64Image(profileImage);
            const key = `profiles/customers/${userId}/${Date.now()}.${parsedImage.extension}`;

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

        if (!Object.keys(userUpdates).length && !Object.keys(customerUpdates).length) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        if (userUpdates.email) {
            const existingEmailUser = await userModel.findOne({ email: userUpdates.email, _id: { $ne: userId } });
            if (existingEmailUser) {
                return res.status(409).json({ message: "Email is already in use" });
            }
        }

        if (Object.keys(userUpdates).length) {
            await userModel.findByIdAndUpdate(
                userId,
                { $set: userUpdates },
                { new: true, runValidators: true }
            );
        }

        if (Object.keys(customerUpdates).length) {
            await customerModel.findOneAndUpdate(
                { userId },
                { $set: customerUpdates },
                { new: true, runValidators: true }
            );
        }

        const updatedCustomer = await customerModel
            .findOne({ userId })
            .populate({ path: "userId", select: "firstname lastname email role profileImage createdAt updatedAt" });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer profile not found" });
        }

        const customerWithImageUrl = await attachProfileImageUrl(updatedCustomer);

        return res.json({
            message: "Profile updated",
            user: customerWithImageUrl.userId,
            customer: customerWithImageUrl
        });

    } catch (err) {
        console.error(err);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ message: err.message || "Server error" });
    }
});

router.get("/logout", logout);

export default router;
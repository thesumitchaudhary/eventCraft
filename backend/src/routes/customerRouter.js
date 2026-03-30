import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { register, verifyEmail, login, logout } from "../controllers/Auth.js"

// import authmiddleware for show user
import authMiddleware from "../Middleware/authMiddleware.js";

// import userModel 
import userModel from "../models/userModel.js";
import customerModel from "../models/customerModel.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey the customer routes is working");
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id

        const customer = await customerModel.findOne({ userId }).populate("userId");

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

        const { firstname, lastname, email, phone, address } = req.body;

        const userUpdates = {};
        const customerUpdates = {};

        if (firstname !== undefined) userUpdates.firstname = firstname;
        if (lastname !== undefined) userUpdates.lastname = lastname;
        if (email !== undefined) userUpdates.email = email;

        if (phone !== undefined) customerUpdates.phone = phone;
        if (address !== undefined) customerUpdates.address = address;

        if (!Object.keys(userUpdates).length && !Object.keys(customerUpdates).length) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        if (userUpdates.email) {
            const existingUser = await userModel.findOne({ email: userUpdates.email, _id: { $ne: userId } });
            if (existingUser) {
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
            .populate({ path: "userId", select: "firstname lastname email role createdAt updatedAt" });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer profile not found" });
        }

        return res.json({
            message: "Profile updated",
            user: updatedCustomer.userId,
            customer: updatedCustomer
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/logout", logout);

export default router;
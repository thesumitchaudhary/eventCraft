import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { register, verifyEmail, login, logout } from "../controllers/Auth.js"

// import authmiddleware for show user
import authMiddleware from "../Middleware/authMiddleware.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey the customer routes is working");
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await customerModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user._id,
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("/me error", error);
        return res.status(500).json({ message: "Server error" });
    }
});
router.post("/create", register);

router.post("/verifyEmail", verifyEmail);

router.post("/login", login);

router.get("/logout", logout);

export default router;
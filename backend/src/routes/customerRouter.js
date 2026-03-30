import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

        const customer = await customerModel.findOne({userId}).populate("userId");

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

router.put("/updateProfile", async (req,res) =>{
    
})

router.get("/logout", logout);

export default router;
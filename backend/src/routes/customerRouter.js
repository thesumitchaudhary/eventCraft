import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import customer model
import customerModel from "../models/customerModel.js";

// import authmiddleware for show user
import authMiddleware from "../Middleware/authMiddleware.js";

// import nodemailer for send email
import sendMail from "../helpers/sendMail.js"

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
router.post("/create", async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;

        // 1️⃣ Basic Validation
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // 2️⃣ Check if user already exists
        const existingUser = await customerModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        // 3️⃣ Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4️⃣ Create User
        const customerCreated = await customerModel.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            phone,
        });

        // 5️⃣ Generate JWT
        const token = jwt.sign(
            {
                id: customerCreated._id,
                email: customerCreated.email,
                firstname: customerCreated.firstname,
                lastname: customerCreated.lastname,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6️⃣ Set Secure Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 7️⃣ Send Professional Welcome Email
        await sendMail(
            email,
            "Welcome to EventCraft – Let’s Create Unforgettable Moments 🎉",
            `Hi ${firstname} ${lastname}, Welcome to EventCraft!`,
            `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        
        <h2 style="color: #6d28d9; text-align: center;">Welcome to EventCraft 🎉</h2>
        
        <p style="font-size: 16px; color: #333;">
          Hi <strong>${firstname} ${lastname}</strong>,
        </p>
        
        <p style="font-size: 15px; color: #555;">
          We're excited to have you onboard! EventCraft helps you plan and book 
          <strong>birthdays, weddings, corporate parties, and special celebrations</strong> 
          with ease and professionalism.
        </p>

        <h3 style="color: #111;">✨ What You Can Do:</h3>
        <ul style="color: #555; font-size: 14px;">
          <li>📅 Book customized events in just a few clicks</li>
          <li>🎨 Choose themes & event types</li>
          <li>💬 Real-Time Live Chat Support</li>
          <li>📊 Track booking status from your dashboard</li>
        </ul>

        <h3 style="color: #111;">💬 Real-Time Chat Support</h3>
        <p style="font-size: 14px; color: #555;">
          Our integrated live chat system allows you to instantly connect 
          with our team for quick assistance and updates.
        </p>

        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:5173/dashboard" 
             style="background-color: #6d28d9; color: white; padding: 12px 20px; 
             text-decoration: none; border-radius: 6px; font-weight: bold;">
             Go to Dashboard
          </a>
        </div>

        <hr style="margin: 25px 0;" />

        <p style="font-size: 12px; color: #888; text-align: center;">
          If you have any questions, reach out via live chat anytime.
          <br/>
          © ${new Date().getFullYear()} EventCraft. All rights reserved.
        </p>

      </div>
      `
        );

        // 8️⃣ Send Response
        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: customerCreated,
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await customerModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "something is wrong" })
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                const token = jwt.sign({ email: user.email, id: user._id, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET);
                res.cookie("token", token);
                res.json(token);
            } else {
                res.json({ message: "something went wrong" })
            }
        });
    } catch (error) {
        res.json(error)
    }
});

router.get("/logout", (req, res) => {
    res.cookie("token", "")
    res.send("hey the customer is logout")
});

export default router;
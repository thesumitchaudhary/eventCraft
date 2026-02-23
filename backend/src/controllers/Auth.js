import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import { SendVerificationCode, WellcomeEmail } from "../helpers/sendMail.js"

// import customer model
import userModel from "../models/userModel.js";
import customerModel from "../models/customerModel.js";

// import nodemailer for send email
import sendMail from "../helpers/sendVerificationMail.js"


export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await userModel.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            verificationCode,
            isVerified: false
        });


        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
        });
        await SendVerificationCode(email, verificationCode);

        if (user.role === "customer") {
            await customerModel.create({
                userId: user._id,
                phone: req.body.phone,
                address: req.body.address,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your email.',
            customerId: user._id
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong. Please try again later.",
        });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (code) {
            const user = await userModel.findOne({
                verificationCode: code  // Fixed typo here
            })
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid or Expired Code" })
            }
            user.verified_at = Date.now();  // Changed from verified_at to isVerified
            user.verificationCode = undefined;  // Fixed typo here too
            await user.save();
            await WellcomeEmail(user.email, user.firstname, user.lastname)
            return res.status(200).json({ success: true, message: "Email verified successfully" })
        }

        else if (email) {
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({ success: false, message: "Email not found" })
            }
            return res.status(200).json({ success: true, message: "Email exists", user })
        }
        return res.status(400).json({ success: false, message: "Email or code required" })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

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
}

export const logout = (req, res) => {
    res.cookie("token", "")
    res.send("hey the customer is logout")
}
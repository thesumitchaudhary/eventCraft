import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import { SendVerificationCode, WellcomeEmail } from "../helpers/sendMail.js"

// import customer model
import userModel from "../models/userModel.js";
import customerModel from "../models/customerModel.js";

// import nodemailer for send email
import sendMail from "../helpers/sendVerificationMail.js"

// this is link with customer routes

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
                role: user.role,
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
// this is link with customer routes
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

// this is link with customer routes
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // FIX: reject only when password does NOT match
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email, firstname: user.firstname, lastname: user.lastname },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// this is link with customer routes
export const logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Customer logged out successfully",
    });
}

// for admin

// this is link with admin routes

export const adminLogin = async (req, res) => {
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
            role: user.role,
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// this is link with admin routes

export const adminLogout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Admin logged out successfully",
    });
}

// this is for employee

// this is link with employee routes

export const employeesCreate = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, designation } = req.body;


        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                try {
                    const userCreated = await userModel.create({
                        firstname,
                        lastname,
                        email,
                        password: hash,
                        phone,
                        role: "employee"
                    });

                    await employeeModel.create({
                        userId: userCreated._id,
                        designation,
                        joiningDate: Date.now(),
                        phone
                    })
                    const token = jwt.sign(
                        {
                            id: userCreated._id,
                            email: userCreated.email,
                            firstname: userCreated.firstname,
                            lastname: userCreated.lastname,
                            role: "employee"
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "7d" }
                    );
                    res.cookie("token", token);
                    res.json(userCreated);
                } catch (createError) {
                    res.status(400).json({ error: createError.message });
                }
            });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// this is link with employee routes

export const employeeLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).json({ error: "Internal server error" });
            }

            if (!result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.cookie("token", token);
            return res.json({
                message: "employee is login successfully",
                token,
                role: user.role,
            });
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


export const employeeLogout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Employee logged out successfully",
    });
}
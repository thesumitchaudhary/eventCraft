import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import userModel from "../models/userModel.js";
import employeeModel from "../models/employeeModel.js";

import adminMiddelware from "../Middleware/adminMiddleware.js"
import authMiddelware from "../Middleware/authMiddleware.js"
import employeeMiddleware from "../Middleware/employeeMiddleware.js"
import {
    generateUploadURL,
    createWorkUpdate,
    uploadWorkEvidenceViaBackend,
    getWorkUpdate,
    deleteWorkUpdate,
} from "../controllers/workContoller.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json("hey it's working")
})

router.get("/me", authMiddelware, async (req, res) => {
    try {
        const userId = req.user.id;

        const employee = await employeeModel.findOne({ userId }).populate("userId");

        res.status(200).json({
            message: "user fetched successfully",
            employee,
        })
    } catch (error) {
        res.json({ message: error })
    }
});

router.put("/user/:id", authMiddelware, async (req, res) => {
    try {
        const userId = req.user.id;
        const routeUserId = req.params.id;

        if (userId !== routeUserId) {
            return res.status(403).json({ message: "you can update your own file" })
        }

        const { firstname, lastname, email, phone } = req.body;

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userUpdates = {};
        const employeeUpdates = {};

        if (firstname !== undefined) userUpdates.firstname = firstname;
        if (lastname !== undefined) userUpdates.lastname = lastname;
        if (email !== undefined) userUpdates.email = email;

        if (phone !== undefined) employeeUpdates.phone = phone;


        if (!Object.keys(userUpdates).length && !Object.keys(employeeUpdates).length) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        if (userUpdates.email) {
            const existingEmailUser = await userModel.findOne({ email: userUpdates.email, _id: { $ne: userId } });
            if (existingEmailUser) {
                return res.status(409).json({ message: "Email is already in use" })
            }
        }

        if (Object.keys(userUpdates).length) {
            await userModel.findByIdAndUpdate(
                userId,
                { $set: userUpdates },
                { new: true, runValidators: true }
            );
        }

        if (Object.keys(employeeUpdates).length) {
            await employeeModel.findByIdAndUpdate(
                { userId },
                { $set: employeeUpdates },
                { new: true, runValidators: true }
            )
        }

        const updateEmployee = await employeeModel.findOne({ userId }).populate({ path: "userId", select: "firstname lastname email phone" })

        if (!updateEmployee) {
            return res.status(404).json({ message: "Customer profile not found" });
        }

        res.status(200).json({ message: "employee updated successfully", updateEmployee })
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
})

router.get("/findEmployee", authMiddelware, async (req, res) => {
    try {
        const employeess = await userModel.find({ role: "employee" }).select("-password");

        const employeeIds = employeess.map(emp => emp._id);

        const employeessdetail = await employeeModel.find({
            userId: { $in: employeeIds }
        }).populate("tasks")

        return res.status(200).json({
            users: employeess,
            details: employeessdetail
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.get("/myTask", authMiddelware, async (req, res) => {
    try {
        const userId = req.user.id;

        const employee = await employeeModel
            .findOne({ userId })
            .populate({
                path: "tasks",
                populate: {
                    path: "eventId",
                    model: "EventBooking"
                }
            })
            .populate("userId", "firstname lastname email phone");

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json({
            success: true,
            employee: {
                firstname: employee.userId?.firstname,
                lastname: employee.userId?.lastname,
                email: employee.userId?.email,
                phone: employee.userId?.phone,
                tasks: employee.tasks
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})


router.post("/create", async (req, res) => {
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
});

router.post("/login", async (req, res) => {
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
            return res.json("employee is login successfully");
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})


router.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.send("Employee is logout successfully")
})

router.post("/work-updates/upload-url", authMiddelware, generateUploadURL);
router.post("/work-updates/upload-file", authMiddelware, uploadWorkEvidenceViaBackend);
router.post("/work-updates", authMiddelware, createWorkUpdate);
router.get("/work-updates/:id", authMiddelware, getWorkUpdate);
router.delete("/work-updates/:id", authMiddelware, deleteWorkUpdate);

export default router;
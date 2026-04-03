import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import userModel from "../models/userModel.js";
import employeeModel from "../models/employeeModel.js";
import { deleteObject, getObjectURL, uploadObject } from "../config/s3.js";

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

// this controller from auth controller
import { employeesCreate, employeeLogin, employeeLogout } from "../controllers/Auth.js"

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

async function attachProfileImageUrl(employeeDoc) {
    if (!employeeDoc) return null;

    const employee = employeeDoc.toObject();
    const profileImageKey = employee?.userId?.profileImage;
    if (!profileImageKey) return employee;

    try {
        employee.userId.profileImageUrl = await getObjectURL(profileImageKey);
    } catch (error) {
        console.error("Failed to create signed profile image URL", error);
        employee.userId.profileImageUrl = null;
    }

    return employee;
}

router.get("/", (req, res) => {
    res.json("hey it's working")
})

router.get("/me", authMiddelware, async (req, res) => {
    try {
        const userId = req.user.id;

        const employeeDoc = await employeeModel.findOne({ userId }).populate("userId");
        const employee = await attachProfileImageUrl(employeeDoc);

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

        const { firstname, lastname, email, phone, profileImage, removeProfileImage } = req.body;

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

        if (profileImage !== undefined && profileImage !== null && profileImage !== "") {
            const parsedImage = parseBase64Image(profileImage);
            const key = `profiles/employee/${userId}/${Date.now()}.${parsedImage.extension}`;

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
            await employeeModel.findOneAndUpdate(
                { userId },
                { $set: employeeUpdates },
                { new: true, runValidators: true }
            )
        }

        const updatedEmployeeDoc = await employeeModel.findOne({ userId }).populate({ path: "userId", select: "firstname lastname email phone profileImage" })
        const updateEmployee = await attachProfileImageUrl(updatedEmployeeDoc);

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

// this is for create of employee from admin

router.post("/create", authMiddelware, adminMiddelware, employeesCreate);
router.post("/login",employeeLogin)
router.get("/logout", employeeLogout);

router.post("/work-updates/upload-url", authMiddelware, generateUploadURL);
router.post("/work-updates/upload-file", authMiddelware, uploadWorkEvidenceViaBackend);
router.post("/work-updates", authMiddelware, createWorkUpdate);
router.get("/work-updates/:id", authMiddelware, getWorkUpdate);
router.delete("/work-updates/:id", authMiddelware, deleteWorkUpdate);

export default router;
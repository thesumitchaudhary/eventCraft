import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import user from "./models/userModel.js";
import admin from "./models/adminModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

const syncAdminDoc = async (u) => {
    if (u.role !== "admin") return;

    await admin.findOneAndUpdate(
        { userId: u._id },
        {
            userId: u._id,
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            role: u.role,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

const adminSeed = async () => {
    try {
        if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
            throw new Error(
                "Missing required env vars: MONGO_URI, ADMIN_EMAIL, ADMIN_PASS, JWT_SECRET"
            );
        }

        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        const existAdmin = await user.findOne({ email: ADMIN_EMAIL });
        if (existAdmin) {
            await syncAdminDoc(existAdmin); // ensure admin collection entry exists

        
            console.log("Admin already exists");
            console.log("Existing admin JWT:", token);
            return;
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const createdAdmin = await user.create({
            firstname: "Chaudhary",
            lastname: "Sumit",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            verified_at: new Date(),
        });

        await syncAdminDoc(createdAdmin);

   

        console.log("Admin created:", createdAdmin.email);
        console.log("Admin JWT:", token);
    } catch (error) {
        console.error("Seed error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

adminSeed();




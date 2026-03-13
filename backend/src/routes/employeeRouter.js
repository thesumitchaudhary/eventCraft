import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import userModel from "../models/userModel.js";
import employeeModel from "../models/employeeModel.js";

import adminMiddelware from "../Middleware/adminMiddleware.js"
import authMiddelware from "../Middleware/authMiddleware.js"
import employeeMiddleware from "../Middleware/employeeMiddleware.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.json("hey it's working")
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
                        designation
                    })
                    const token = jwt.sign({ id: userCreated._id, email: userCreated.email, firstname: userCreated.firstname, lastname: userCreated.lastname }, "shhhhhh")
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
                { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname },
                process.env.JWT_SECRET
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





export default router;
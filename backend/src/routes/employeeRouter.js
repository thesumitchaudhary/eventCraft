import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import userModel from "../models/userModel.js";
import employeeModel from "../models/employeeModel.js";

import adminMiddelware from "../Middleware/adminMiddleware.js"
import authMiddelware from "../Middleware/authMiddleware.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.json("hey it's working")
})

router.post("/create", authMiddelware, adminMiddelware, async (req, res) => {
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
                    });

                    await employeeModel.create({
                        userId: userCreated._id,
                        designation
                    })
                    const token = jwt.sign({ email, firstname, lastname }, "shhhhhh")
                    res.cookie("token", token);
                    res.json(employeeCreated);
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
        const employee = await employeeModel.findOne({ email });

        if (!employee) {
            res.json("something were wrong");
        }

        bcrypt.compare(password, employee.password, function (err, result) {
            if (result) {
                const token = jwt.sign({ email }, "shhhhhh");
                res.cookie("token", token);
                res.json("employee is login successfully");
            }
        });
    }
    catch (error) {
        res.json(error);
    }
})


router.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.send("Employee is logout successfully")
})


export default router;
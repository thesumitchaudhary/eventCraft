import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// import admin model
import adminModel from "../models/adminModel.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey this is admin Router")
})

router.post("/create", (req, res) => {
    try {
        const { firstName, lastName, email, passowrd, } = req.body;

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(passowrd, salt, async function (err, hash) {
                const adminCreated = await adminModel.create({
                    firstName,
                    lastName,
                    email,
                    passowrd: hash
                })
                let token = jwt.sign({ email }, "shhhhhh");
                res.cookie("token", token);
                res.json(adminCreated);
            });
        });
    }
    catch (error) {
        res.json({ error })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            res.json({ message: "Something were wrong" });
        }

        bcrypt.compare(password, admin.passowrd, function (err, result) {
            if (result) {
                const token = jwt.sign({ email }, "shhhhhh");
                res.cookie("token", token);
                res.json({ message: "hey the admin is login successfully" })
            }
        });
    }
    catch (error) {
        res.json(error);
    }
})


router.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.json("hey the admin is logout successfully");
})

export default router
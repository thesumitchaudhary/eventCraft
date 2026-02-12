import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import customer model
import customerModel from "../models/customerModel.js";

// import authmiddleware for show user
import authMiddleware from "../Middleware/authMiddleware.js";

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


router.post("/create", (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                const customerCreated = await customerModel.create({
                    firstname,
                    lastname,
                    email,
                    password: hash,
                    phone
                })
                const token = jwt.sign({ email: customerCreated.email, firstName: customerCreated.firstName, lastName: customerCreated.lastName, id: customerCreated._id     }, process.env.JWT_SECRET);
                res.cookie("token", token);
                res.json({ customerCreated })
            });

        });
    }
    catch (error) {
        res.json({ error })
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
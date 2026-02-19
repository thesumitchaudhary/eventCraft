import jwt from "jsonwebtoken";
import customerModel from "../models/customerModel.js"

export default async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect("/api/customer/")
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await customerModel.findOne({ email: decoded.email }).select("-password");

        req.user = user;

        next();
    } catch (err) {
        // res.redirect("/api/customer")
    }
}
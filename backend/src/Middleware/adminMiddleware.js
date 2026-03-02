import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next();
};

export default adminMiddleware;

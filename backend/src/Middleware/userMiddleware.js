import jwt from "jsonwebtoken";

const userMiddleware = (req, res, next) => {
    if (req.user.role !== "customer") {
        return res.status(403).json({ message: "Forbidden: Employee access only" });
    }
    next();
}

export default userMiddleware;
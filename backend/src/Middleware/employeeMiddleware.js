import jwt from "jsonwebtoken";

const employeeMiddleware = (req, res, next) => {
    if (req.user.role === "employee") {
        return res.status(403).json({ message: "Forbidden: Employee access only" });
    }
    next();
}

export default employeeMiddleware;
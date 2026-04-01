import http from "http";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { Server } from "socket.io";

// routes
import adminRouter from "./routes/adminRouter.js";
import customerRouter from "./routes/customerRouter.js";
import employeeRouter from "./routes/employeeRouter.js";
import indexRouter from "./routes/index.js";

// models
import Ticket from "./models/ticketModel.js";
import Message from "./models/messageModel.js";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_CONNECT_URL = process.env.MONGO_URI;

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO SETUP =================
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// ================= MEMORY STORE =================
const users = {};
const admins = new Set();

// ================= SOCKET AUTH MIDDLEWARE =================
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = user; // { id, role }

        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

// ================= SOCKET CONNECTION =================
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ================= JOIN TICKET =================
    socket.on("join_ticket", async ({ ticketId }) => {
        try {
            const { id: userId, role } = socket.user;

            const ticket = await Ticket.findById(ticketId);

            if (!ticket) {
                return socket.emit("error", "Ticket not found");
            }

            // 🔐 BASIC ACCESS CONTROL
            if (
                role === "customer" &&
                ticket.customerId.toString() !== userId
            ) {
                return socket.emit("error", "Unauthorized access");
            }

            socket.join(ticketId);

            users[socket.id] = { ticketId, role, userId };

            // track admin
            if (role === "admin") {
                admins.add(socket.id);
            }

            // assign employee
            if (role === "employee") {
                if (!ticket.employeeId) {
                    ticket.employeeId = userId;
                    ticket.status = "active";
                    await ticket.save();
                }
            }

            console.log(`${role} joined ticket ${ticketId}`);
        } catch (err) {
            console.error(err);
        }
    });

    // ================= SEND MESSAGE =================
    socket.on("send_message", async ({ ticketId, message }) => {
        try {
            const user = users[socket.id];

            if (!user) return;

            // save message
            const newMessage = await Message.create({
                ticketId,
                senderId: user.userId,
                senderRole: user.role,
                message,
            });

            // emit to room
            io.to(ticketId).emit("receive_message", newMessage);
        } catch (err) {
            console.error(err);
        }
    });

    // ================= ESCALATE =================
    socket.on("escalate", async ({ ticketId }) => {
        try {
            await Ticket.findByIdAndUpdate(ticketId, {
                status: "escalated",
            });

            // notify only admins
            admins.forEach((adminId) => {
                io.to(adminId).emit("admin_notification", {
                    ticketId,
                    message: "Ticket needs admin support",
                });
            });

            console.log("Ticket escalated:", ticketId);
        } catch (err) {
            console.error(err);
        }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
        if (users[socket.id]?.role === "admin") {
            admins.delete(socket.id);
        }

        delete users[socket.id];

        console.log("User disconnected:", socket.id);
    });
});

// ================= EXPRESS MIDDLEWARE =================
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.disable("etag");

// ================= ROUTES =================
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/index", indexRouter);

// ================= SERVER START =================
const start = async () => {
    if (!MONGO_CONNECT_URL) {
        console.log("MONGO_CONNECT_URL is not set.");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_CONNECT_URL);
        console.log("MongoDB connected");

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB error:", err.message);
        process.exit(1);
    }
};

start();
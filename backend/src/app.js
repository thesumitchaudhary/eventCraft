import http from "http";
import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";

// import the file
import adminRouter from "./routes/adminRouter.js"
import customerRouter from "./routes/customerRouter.js"
import employeeRouter from "./routes/employeeRouter.js"
import indexRouter from "./routes/index.js"

dotenv.config();

const PORT = process.env.PORT
const MONGO_CONNECT_URL = process.env.MONGO_URI
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// this is for the connection to the server
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
        // console.log("Message received:", data);

        // send to all users
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser())


app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/index", indexRouter)

const start = async () => {
    if (!MONGO_CONNECT_URL) {
        console.log("MONGO_CONNECT_URL is not set. Add it to your .env file.");
        process.exit(1);
    } else {
        try {
            await mongoose.connect(MONGO_CONNECT_URL)
            console.log("mongodb is connected");

            server.listen(PORT, () => {
                console.log(`the server is running on port ${PORT}`);
            });
            // app.listen(PORT, () => {
            //     console.log(`the server is running on port ${PORT}`);
            // })
        }
        catch (err) {
            console.error("MongoDB connection error:", err.message);
            process.exit(1);
        }
    }
}


start()
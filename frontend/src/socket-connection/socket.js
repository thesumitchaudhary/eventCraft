import { io } from "socket.io-client";

const socket = io("http://localhost:4041", {
    withCredentials: true,
});

export default socket;
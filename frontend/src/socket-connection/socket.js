import { io } from "socket.io-client";

const socket = io("http://localhost:4041", {
  transports: ["websocket"], // important
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"), // if using JWT
  },
});

export default socket;
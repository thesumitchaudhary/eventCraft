import { io } from "socket.io-client";

const socket = io("http://localhost:4041", {
  transports: ["websocket"], // important
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"), // if using JWT
  },
});

export const syncSocketAuth = (token) => {
  const nextToken = token || localStorage.getItem("token") || "";

  socket.auth = nextToken ? { token: nextToken } : {};

  if (!socket.connected) {
    socket.connect();
    return;
  }

  socket.disconnect();
  socket.connect();
};

export default socket;
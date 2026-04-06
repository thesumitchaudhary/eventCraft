import { io } from "socket.io-client";

const socket = io("http://localhost:4041", {
  transports: ["websocket"],
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"),
  },
});

export const syncSocketAuth = (token?: string) => {
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
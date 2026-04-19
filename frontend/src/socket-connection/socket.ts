import { io } from "socket.io-client";

const rawApiBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4041/api";
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, "").endsWith("/api")
  ? rawApiBaseUrl.replace(/\/$/, "")
  : `${rawApiBaseUrl.replace(/\/$/, "")}/api`;
const socketBaseUrl = normalizedApiBaseUrl.replace(/\/api$/, "");

const socket = io(socketBaseUrl, {
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
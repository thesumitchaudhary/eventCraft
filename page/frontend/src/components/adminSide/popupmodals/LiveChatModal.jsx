import React, { useState, useEffect, useRef } from "react";
import { X, Circle, Send } from "lucide-react";
import socket from "../../../socket-connection/socket";

const LiveChatModal = ({ closeLiveModal }) => {
  const [isOnline, setIsOnline] = useState(socket.connected);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ticketId, setTicketId] = useState(null); // 🔥 important

  const bottomRef = useRef(null);

  // ================= ONLINE STATUS =================
  useEffect(() => {
    socket.on("connect", () => setIsOnline(true));
    socket.on("disconnect", () => setIsOnline(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // ================= LISTEN FOR ESCALATION =================
  useEffect(() => {
    const handleAdminNotification = (data) => {
      console.log("New escalated ticket:", data.ticketId);

      // set current ticket
      setTicketId(data.ticketId);

      // join that room
      socket.emit("join_ticket", { ticketId: data.ticketId });
    };

    socket.on("admin_notification", handleAdminNotification);

    return () => {
      socket.off("admin_notification", handleAdminNotification);
    };
  }, []);

  // ================= RECEIVE MESSAGE =================
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        const exists = prev.find((msg) => msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!message.trim() || !ticketId) return;

    socket.emit("send_message", {
      ticketId,
      message,
    });

    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={closeLiveModal}
    >
      <div
        className="w-[900px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Admin Support Panel</h2>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 text-sm ${
                isOnline ? "text-green-600" : "text-red-500"
              }`}
            >
              <Circle
                className={`h-3 w-3 ${
                  isOnline
                    ? "fill-green-500 text-green-500"
                    : "fill-red-500 text-red-500"
                }`}
              />
              {isOnline ? "Online" : "Offline"}
            </div>

            <X
              onClick={closeLiveModal}
              className="cursor-pointer text-gray-500 hover:text-black"
            />
          </div>
        </div>

        {/* ================= TICKET INFO ================= */}
        <div className="px-4 py-2 text-sm text-gray-600 border-b">
          {ticketId
            ? `Connected to Ticket: ${ticketId}`
            : "Waiting for escalated tickets..."}
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {!ticketId && (
            <div className="text-gray-400">
              No escalated tickets yet...
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex flex-col max-w-max p-2 rounded-2xl ${
                msg.senderRole === "admin"
                  ? "bg-blue-300 ml-auto"
                  : "bg-gray-200"
              }`}
            >
              <span>{msg.message}</span>
              <span className="text-gray-500 text-[10px]">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* ================= INPUT ================= */}
        <div className="p-4 border-t flex gap-3">
          <input
            type="text"
            placeholder={
              ticketId
                ? "Reply to escalated ticket..."
                : "Waiting for ticket..."
            }
            className="flex-1 rounded-md bg-gray-100 px-3 py-2 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!ticketId}
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white p-3 rounded-md"
            disabled={!ticketId}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;
import React, { useState, useEffect, useRef } from "react";
import { Circle, Send, X } from "lucide-react";
import socket from "../../../socket-connection/socket";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const LiveChatLayout = ({ closeLiveModal, ticketId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(socket.connected);
  const [loading, setLoading] = useState(false);
  const [resolvedTicketId, setResolvedTicketId] = useState(ticketId || "");

  const activeTicketId = ticketId || resolvedTicketId;

  const bottomRef = useRef(null);
  const safeMessages = Array.isArray(messages) ? messages : [];

  const normalizeMessageList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  // ================= SOCKET + FETCH =================
  useEffect(() => {
    if (ticketId) return;

    const resolveTicket = async () => {
      try {
        const res = await fetch(`${API_URL}/index/support-ticket`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data?.ticketId) {
          setResolvedTicketId(data.ticketId);
        }
      } catch (err) {
        console.error("Failed to resolve ticket", err);
      }
    };

    resolveTicket();
  }, [ticketId, API_URL]);

  useEffect(() => {
    if (!activeTicketId) return;

    // join room
    socket.emit("join_ticket", { ticketId: activeTicketId });

    // receive message (avoid duplicates)
    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        const prevMessages = Array.isArray(prev) ? prev : [];

        if (!data || typeof data !== "object") {
          return prevMessages;
        }

        const exists = prevMessages.find((msg) => msg._id === data._id);
        if (exists) return prevMessages;
        return [...prevMessages, data];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    // fetch old messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/index/messages/${activeTicketId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(normalizeMessageList(data));
      } catch (err) {
        console.error("Failed to fetch messages", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeTicketId, API_URL]);

  // ================= ONLINE STATUS =================
  useEffect(() => {
    const handleConnect = () => setIsOnline(true);
    const handleDisconnect = () => setIsOnline(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!message.trim() || !activeTicketId) return;

    socket.emit("send_message", {
      ticketId: activeTicketId,
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
        className="w-[900px] h-[500px] fixed top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 
        bg-white rounded-xl shadow-lg flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex flex-col">
          {/* ================= HEADER ================= */}
          <div className="p-4 border-b flex justify-between items-start">
            <div>
              <h2 className="font-semibold">Support System</h2>

              <div
                className={`flex items-center gap-2 text-sm ${
                  isOnline ? "text-green-600" : "text-red-500"
                }`}
              >
                <Circle
                  className={`h-3 ${
                    isOnline
                      ? "fill-green-500 text-green-500"
                      : "fill-red-500 text-red-500"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>

            <X
              onClick={closeLiveModal}
              className="cursor-pointer text-gray-500 hover:text-black"
            />
          </div>

          {/* ================= MESSAGES ================= */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {loading && (
              <div className="text-gray-500 text-sm">Loading messages...</div>
            )}

            {!loading && safeMessages.length === 0 && (
              <div className="text-gray-400 text-sm">
                No messages yet. Start conversation 👋
              </div>
            )}

            {safeMessages.map((msg) => (
              <div
                key={msg._id || `${msg.createdAt || "no-time"}-${msg.senderId || "no-sender"}`}
                className={`flex flex-col max-w-max p-2 rounded-2xl ${
                  msg.senderRole === "customer"
                    ? "bg-blue-300 ml-auto"
                    : "bg-gray-200"
                }`}
              >
                <span>{msg.message || msg.text || ""}</span>
                <span className="text-gray-500 text-[10px]">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : msg.time || ""}
                </span>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* ================= INPUT ================= */}
          <div className="p-4 border-t flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-md bg-gray-100 px-3 py-2 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white p-3 rounded-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatLayout;
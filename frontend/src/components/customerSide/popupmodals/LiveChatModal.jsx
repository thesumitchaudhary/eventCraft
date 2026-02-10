import React, { useState, useEffect } from "react";
import { Circle, Send, X } from "lucide-react";
import socket from "../../../socket-connection/socket";

const LiveChatLayout = ({ closeLiveModal }) => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [messages, setMessages] = useState([]);
  const [mode, setmode] = useState(true);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // store the DATA coming from server, not input message
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // cleanup
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      text: message,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
             bg-black/30 backdrop-blur-md"
      onClick={closeLiveModal}
    >
      <div
        className="w-[900px] h-[500px] fixed top-1/2 left-1/2 
               -translate-x-1/2 -translate-y-1/2 
               bg-white rounded-xl shadow-lg flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-px bg-gray-300" />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-start">
            <div>
              <h2 className="font-semibold">Support System</h2>
              <div
                className={`flex items-center gap-2 text-sm ${
                  mode ? "text-green-600" : "text-red-500"
                }`}
              >
                <Circle
                  className={`h-3 ${
                    mode
                      ? "fill-green-500 text-green-500"
                      : "fill-red-500 text-red-500"
                  }`}
                />
                {mode ? "Online" : "Offline"}
              </div>
            </div>

            <X
              onClick={closeLiveModal}
              className="cursor-pointer text-gray-500 hover:text-black"
            />
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            <div className="bg-gray-100 p-3 rounded-lg max-w-sm">
              Hello! How can I help you today?
            </div>
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col bg-blue-300 max-w-max p-2 rounded-2xl ml-auto">
                <span> {msg.text} </span> <span className="text-gray-500 text-[10px]">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
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

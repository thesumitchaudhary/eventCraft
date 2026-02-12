import React, { useState, useEffect } from "react";
import { X, Circle, Send } from "lucide-react";
import socket from "../../../socket-connection/socket";

const LiveChatModal = ({ closeLiveModal }) => {
  const [mode, setMode] = useState("online");
  const [message, setMessage] = useState("");
  const [storeMessage, setStoreMessage] = useState([]);

  useEffect(() => {
    const handleRecieveMessege = (data) => {
      setStoreMessage((prev) => [...prev, data]);
    };

    socket.on("recieve_message", handleRecieveMessege);

    return () => {
      socket.off("recieve_message", handleRecieveMessege);
    };
  }, []);

  const isOnline = mode === "online";

  // const anotherFunction = () => {
  //    socket.off("recieve_message", handleRecieveMessege);
  // };

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);

    setStoreMessage((prev) => [...prev, msgData]); // instantly show
    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={() => {
        closeLiveModal(); // prop function
        anotherFunction(); // your local function
      }}
    >
      {/* Modal Box */}
      <div
        className="w-[900px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Support System</h2>

          <div className="flex items-center gap-4">
            {/* Status */}
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

            {/* Close Button */}
            <X
              onClick={closeLiveModal}
              className="cursor-pointer text-gray-500 hover:text-black"
            />
          </div>
        </div>

        {/* Messages Section */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="bg-gray-100 p-3 rounded-lg max-w-sm">
            Hello! How can I help you today?
          </div>
          {storeMessage.map((msg, index) => (
            <div
              key={index}
              className="flex flex-col bg-blue-300 max-w-max p-2 rounded-2xl ml-auto"
            >
              <span> {msg.text} </span>{" "}
              <span className="text-gray-500 text-[10px]">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-md bg-gray-100 px-3 py-2 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;

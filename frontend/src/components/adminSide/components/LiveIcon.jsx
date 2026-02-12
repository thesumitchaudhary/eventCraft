import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import socket from "../../../socket-connection/socket";

import LiveChatModal from "../popupmodals/LiveChatModal";

const LiveIcon = () => {
  const [openLiveModal, setOpenLiveModal] = useState(false);

  const controlLive = () => {
    socket.on("recieve_message", handleRecieveMessege);
  };

  const toOpenLiveModal = () => {
    setOpenLiveModal(true);
  };

  const closeLiveModal = () => {
    setOpenLiveModal(false);
  };
  return (
    <>
      <div>
        <button
          onClick={(e) => {
            toOpenLiveModal();
            controlLive();
          }}
          className="fixed top-140 z-10 rounded-full bg-black text-white p-4"
        >
          <MessageCircle />
        </button>
      </div>
      {openLiveModal && <LiveChatModal closeLiveModal={closeLiveModal} />}
    </>
  );
};

export default LiveIcon;

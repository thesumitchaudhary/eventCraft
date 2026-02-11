import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

import LiveChatModal from "../popupmodals/LiveChatModal";

const LiveIcon = () => {
  const [openLiveModal, setOpenLiveModal] = useState(false);

  const closeLiveModal = () => {
    setOpenLiveModal(false);
  };
  return (
    <>
      <div>
        <button
          onClick={(e) => setOpenLiveModal(true)}
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

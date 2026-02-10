import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import LiveChatModal from "../../popupmodals/LiveChatModal";
import toast, { Toaster } from "react-hot-toast";

const LiveIcon = () => {
  const [openLiveModal, setOpenLiveModal] = useState(false);

  useEffect(() => {
    if (openLiveModal) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [openLiveModal]);

  const notify = () => toast("you close the chat.");

  const closeLiveModal = () => {
    notify();
    setOpenLiveModal(false);
  };

  return (
    <>
      <button
        onClick={(e) => setOpenLiveModal(true)}
        className="fixed top-140 rounded-full max-w-max bg-black text-white p-4"
      >
        <MessageCircle />
      </button>
      <Toaster />
      {openLiveModal && <LiveChatModal closeLiveModal={closeLiveModal} />}
    </>
  );
};

export default LiveIcon;

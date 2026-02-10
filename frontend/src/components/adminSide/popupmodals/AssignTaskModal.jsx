import React from "react";

const AssignTaskModal = ({closeTaskModal}) => {
  return (
    <>
      <div>
        <div
          className="fixed left-0 right-0 bottom-0 top-0 bg-gray-200"
          onClick={close}
        ></div>
        <div className="fixed top-70 left-100 max-w-xl border border-gray-400 bg-white rounded-2xl p-2">
            <button onClick={closeTaskModal}>close</button>
        </div>
      </div>
    </>
  );
};

export default AssignTaskModal;

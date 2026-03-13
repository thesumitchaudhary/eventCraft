import React, { useState, useRef } from "react";
import { X } from "lucide-react";

const updateTaskModal = ({ closeUpdateModal }) => {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef(null);

  const updateProgress = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    let value = ((clientX - rect.left) / rect.width) * 100;

    if (value <= 0) value = 0;
    if (value >= 100) value = 100;

    setProgress(value);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    updateProgress(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    updateProgress(e.clientX);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="z-1">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={closeUpdateModal}
      />

      <div
        className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                max-w-xl w-full
                bg-white rounded-2xl p-4 z-50"
      >
        <div className="flex justify-between">
          <div>
            <h3>Update Task Status</h3>
            <p>Setup Wedding Venue Decorations</p>
          </div>
          <div>
            <button onClick={closeUpdateModal}>
              <X />
            </button>
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <label htmlFor="">status</label>
            <select name="" id="">
              <option value="">In Progress</option>
              <option value="">Pending</option>
              <option value="">Completed</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Work Update</label>
            <input
              type="text"
              placeholder="Floral arrangements ordered. Setting up stage decorations."
            />
          </div>
          <div>
            <div className="flex justify-between">
              <span>event Progress</span>
              <span>{Math.floor(progress)}</span>
            </div>
            <div
              ref={barRef}
              className="w-full h-4 bg-gray-300 rounded-2xl relative cursor-pointer"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* filled bar */}
              <div
                className="bg-black h-4 rounded-2xl relative"
                style={{ width: `${progress}%` }}
              >
                {/* knob */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-white border border-black rounded-full"></span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Upload Work Evidence</label>
            <input type="file" />
          </div>
        </div>
        <div className="w-full">
          <button>
            <span className="bg-black text-white rounded-md px-3 py-2">
              Update Work
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default updateTaskModal;

import React, { useState } from "react";
import { X } from "lucide-react";

const ProfileModal = ({ closeProfileModal }) => {
  return (
    <>
      <div>
         <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeProfileModal}
        />  

        <div
          className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                max-w-xl w-full
                bg-white rounded-2xl p-4 z-50"
        >
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Update Profile</h1>
              <p>Update your account information</p>
            </div>
            <button onClick={closeProfileModal}>
              <X />
            </button>
          </div>
          <form action="" className="flex flex-col gap-4">
            <div>
              <input type="text" className="border p-1 w-full rounded-full" placeholder="Enter Your Value" />
            </div>
            <div>
              <input type="text" className="border p-1 w-full rounded-full" placeholder="Enter Your Value" />
            </div>
            <div>
              <input type="text" className="border p-1 w-full rounded-full" placeholder="Enter Your Value" />
            </div>
            <div>
              <input type="text" className="border p-1 w-full rounded-full" placeholder="Enter Your Value" />
            </div>
            <div>
              <input type="text" className="border p-1 w-full rounded-full" placeholder="Enter Your Value" />
            </div>
            <div>
              <button className="border p-1 w-full rounded-md bg-black text-white font-medium">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;

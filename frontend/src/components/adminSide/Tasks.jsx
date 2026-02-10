import React, { useState } from "react";
import { ClipboardList } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import AssignTaskModal from "./popupmodals/AssignTaskModal";

const Tasks = () => {
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const closeTaskModal = () => {
    setOpenTaskModal(false);
  };
  return (
    <div className="bg-[#ececec]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex justify-between">
            <h1>Task Management</h1>
            <button
              onClick={(e) => setOpenTaskModal(true)}
              className="flex text-sm bg-black text-white p-2 rounded-2xl"
            >
              <ClipboardList className="h-4" /> Assign Task
            </button>
            {openTaskModal && (
              <AssignTaskModal closeTaskModal={closeTaskModal} />
            )}
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5">
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-2">Task</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Assigned To</th>
                  <th className="py-2">Priority</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Due Date</th>
                  <th className="py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Setup Wedding Venue Decorations
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    Arrange floral decorations for the Johnson wedding at Grand
                    Hotel
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    Sarah Johnson
                  </td>
                  <td className="border-b  border-gray-300 p-1">
                    <span className="bg-[#ffe2e2] p-1 px-2 text-xs rounded-xl text-[#b10712]">
                      high
                    </span>
                  </td>
                  <td className="border-b  border-gray-300">
                    <span className="bg-black text-white text-xs p-1 rounded-xl">
                      in-progress
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">2026-01-25</td>
                  <td className="border-b border-gray-300 p-1">2026-01-15</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Corporate Event Catering Coordination
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    Coordinate with catering team for Tech Corp annual
                  </td>
                  <td className="border-b border-gray-300 p-1">Mike Davis</td>
                  <td className="border-b  border-gray-300 p-1">
                    <span className="bg-[#fef9c2] p-1 px-2 text-xs rounded-xl text-[#984b00]">
                      Meduim
                    </span>
                  </td>
                  <td className="border-b  border-gray-300">
                    <span className="bg-gray-300 text-black text-xs p-1 rounded-xl">
                      pending
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">2026-02-01</td>
                  <td className="border-b border-gray-300 p-1">2026-01-18</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Birthday Party Entertainment Setupn
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    Setup sound system and lighting for kids birthday party
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    Sarah Johnson
                  </td>
                  <td className="border-b  border-gray-300 p-1">
                    <span className="bg-[#dbfce7] p-1 px-2 text-xs rounded-xl text-[#246630]">
                      low
                    </span>
                  </td>
                  <td className="border-b  border-gray-300">
                    <span className="bg-black text-white text-xs p-1 rounded-xl">
                      completed
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">2026-02-01</td>
                  <td className="border-b border-gray-300 p-1">2026-01-18</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tasks;

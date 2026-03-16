import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

import AssignTaskModal from "./popupmodals/AssignTaskModal";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error("Request Failed");
  }

  return body;
};

const Tasks = () => {
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const closeTaskModal = () => {
    setOpenTaskModal(false);
  };

  const { data } = useQuery({
    queryKey: ["allTaskDetails"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/findEmployee"),
  });

  const users = Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
      ? data.users
      : [];
  const details = Array.isArray(data?.details) ? data.details : [];

  // merge users + details (match by userId if available, else by index)
  const employees = users.map((user, index) => {
    const detail =
      details.find((d) => d.userId === user._id || d.user?._id === user._id) ||
      details[index] ||
      {};

    return { ...user, ...detail };
  });

  const taskRows = employees.flatMap((employee) =>
    (employee?.tasks || []).map((task, idx) => ({
      rowKey: `${employee._id || employee.userId || "emp"}-${task?._id || idx}`,
      taskTitle: task?.taskTitle || "-",
      taskDescription: task?.taskDescription || "-",
      assignedTo: `${employee?.firstname || ""} ${employee?.lastname || ""}`.trim() || "-",
      priority: task?.priority || "-",
      status: task?.status || "-",
      dueDate: task?.selectDate,
      createdAt: task?.createdAt,
    }))
  );

  const formatDate = (value) => {
    const d = value ? new Date(value) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : "-";
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
          <div className="bg-gray-50 p-5 border border-gray-300 rounded-2xl">
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
                {taskRows.map((row) => (
                  <tr key={row.rowKey} className="border-b border-black">
                    <td className="py-2 border-b border-gray-300 p-1">{row.taskTitle}</td>
                    <td className="border-b border-gray-300 p-1">{row.taskDescription}</td>
                    <td className="border-b border-gray-300 p-1">{row.assignedTo}</td>
                    <td className="border-b border-gray-300 p-1">
                      <span className="bg-[#ffe2e2] p-1 px-2 text-xs rounded-xl text-[#b10712]">
                        {row.priority}
                      </span>
                    </td>
                    <td className="border-b border-gray-300">
                      <span className="bg-black text-white text-xs p-1 rounded-xl">
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-gray-300 p-1">{formatDate(row.dueDate)}</td>
                    <td className="border-b border-gray-300 p-1">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
                {/* <tr className="border-b border-black">
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
                </tr> */}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tasks;

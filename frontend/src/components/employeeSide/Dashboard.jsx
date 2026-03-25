import React, { useState } from "react";
import { CircleAlert, Upload, Clock4 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";
import UpdateTaskModal from "./popupModals/UpdateTaskModal";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const Dashboard = () => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const closeUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const { data } = useQuery({
    queryKey: ["showSigninEmployee"],
    queryFn: () => fetcher(`http://localhost:4041/api/employee/myTask`),
  });

  console.log(data?.employee?.tasks.map((task) => task));

  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          {data?.employee?.tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-50 p-5 rounded-2xl grid grid-rows-2"
            >
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <h4 className="text-lg ">
                    {/* Setup Wedding Venue Decorations */}
                    {task.taskTitle}
                  </h4>
                  <div className="flex gap-5">
                    <span className="text-sm text-red-500 bg-red-200 px-3 p-1 rounded-full">
                      {/* high */}
                      {task.priority}
                    </span>
                    <span className="flex gap-1 text-xs bg-black text-white px-3 py-1 rounded-xl">
                      {/* in-progress */}
                      <Clock4 className="h-4 w-4" /> {task.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400">
                  {/* Arrange floral decorations for the Johnson wedding at Grand
                  Hotel */}
                  {task.taskDescription}
                </p>
              </div>

              <div className="p-4 bg-purple-100 rounded-md border border-purple-500">
                <div>
                  <span>Event Details</span>
                </div>
                <div>
                  <p className="grid grid-cols-2">
                    <span className="text-gray-600">
                      Event:{" "}
                      <span className="text-black ">
                        {task?.eventId?.eventName}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Progress: <span className="text-blackl">0%</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 mt-7">
                <div>
                  <p>Created</p>
                  <p className="font-bold text-xs">
                    {/* 2026-01-15 */}
                    {new Date(task?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p>Due Date</p>
                  <p className="font-bold text-xs">
                    {/* 2026-01-25 */}
                    {new Date(task?.selectDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p>Priority</p>
                  <p className="font-bold text-xs">
                    {/* high */} {task.priority}
                  </p>
                </div>
              </div>
              <div className="flex flex-col my-4 bg-gray-100 p-2 rounded-2xl">
                <span className="text-gray-600 font-bold text-xs">
                  Work Updates:
                </span>
                <span className="text-gray-400">
                  Floral arrangements ordered. Setting up stage decorations.
                </span>
              </div>
              <div className="my-5 flex justify-end">
                <button
                  onClick={() => setOpenUpdateModal(true)}
                  className="flex p-2 rounded-2xl bg-black text-white"
                >
                  <Upload />
                  <span>update Statues</span>
                </button>
              </div>
              {openUpdateModal && (
                <UpdateTaskModal closeUpdateModal={closeUpdateModal} />
              )}
            </div>
          ))}
        </section>
        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

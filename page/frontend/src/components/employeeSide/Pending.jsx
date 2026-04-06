import React, { useState } from "react";
import {
  CircleCheck,
  Clock4,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";
import UpdateTaskModal from "./popupModals/UpdateTaskModal";

import LiveIcon from "./components/LiveIcon";

const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store", // prevents 304 cache validation flow
    headers: {
      Accept: "application/json",
    },
  });

  let body = {};
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      body = await res.json();
    } catch {
      body = {};
    }
  }

  if (!res.ok) {
    const err = new Error(body?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return body;
};

const Pending = () => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const closeUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedTask(null);
  };

  const openTaskUpdateModal = (task) => {
    setSelectedTask(task);
    setOpenUpdateModal(true);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["showSigninEmployee"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/myTask"),
  });

  const pendingTasks =
    data?.employee?.tasks?.filter((task) => task.status !== "in-progress") || [];

  console.log(pendingTasks.length);

  if (isLoading) {
    return (
      <div className="bg-[#ededed] min-h-screen">
        <Header />
        <main className="my-10 mx-5">Loading...</main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#ededed] min-h-screen">
        <Header />
        <main className="my-10 mx-5 text-red-600">
          {error?.message || "Failed to load tasks"}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          {pendingTasks.length === 0 ?(<div> </div>): (
          <div className="flex justify-between animate-pulse bg-linear-to-r from-[#ff6b00] to-[#fe9800] p-10 rounded-xl">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-[#ff8a33] text-white p-2 mt-1">
                <Clock4 />
              </div>
              <div className="text-white">
                <h4 className="text-2xl font-bold">Pending Tasks</h4>
                <p>You have 1 task waiting for your action</p>
              </div>
            </div>
            <div className="h-10 w-10 py-1 px-4 rounded-xl bg-white">
              <span className="text-2xl font-bold text-[#fe9800]">1</span>
            </div>
          </div>
          )}
        </section>
        <section className="my-10 mx-5">
          {pendingTasks.length === 0 ? (
            <div className="bg-gray-50 p-40 rounded-2xl grid place-items-center">
              <div>
                <CircleCheck className="text-green-500 h-20 w-30" />
                No pending tasks!
              </div>
            </div>
          ) : (
            <div>
              {pendingTasks.map((task) => {

                return (
                  <div
                    key={task._id}
                    className="bg-gray-50 p-5 border border-[#ff6b00] rounded-2xl grid grid-rows-2"
                  >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <h4 className="text-lg flex">
                        <span className="h-9 w-8 bg-[#ffedd4] text-white p-1 rounded-full">
                          <ClipboardList className="text-[#ff6b00]" />
                        </span>
                        {task.taskTitle}
                      </h4>
                      <div className="flex gap-5">
                        <span className="bg-[#ff6b00] h-12 w-12 p-3 rounded-full text-xl font-semibold text-white">
                          {task.length}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400">{task.taskDescription}</p>
                  </div>
                  <div>
                    <span className="text-sm px-3 p-1 rounded-full">
                          {task.priority === "Medium" ? (
                        <span className="bg-[#fef9c2] text-[#90550b] p-1 rounded-md">
                          Medium
                        </span>
                      ) : task.priority === "High" ? (
                        <span className="text-red-500 bg-red-200 ">High</span>
                      ) : (
                        <span className="bg-[#dbfce7] text-[#157441]">Low</span>
                      )}
                    </span>
                  </div>

                  <div className="mt-4 rounded-3xl border border-[#cfb7f3] bg-[#f4f5fb] p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#9d4edd]">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#3c147f] md:text-xl">
                        Linked Event
                      </h3>
                    </div>

                    <div className="mt-7 space-y-7 pl-1">
                      <div>
                        <p className="text-3xl text-[#415a77]">Event Name</p>
                        <p className="mt-2 text-xl font-semibold text-[#0b1d3a]">
                          {task?.eventId?.eventName}
                        </p>
                      </div>

                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xl text-[#415a77]">Overall Progress</p>
                          <span className="text-xl font-semibold text-[#8a2be2]">
                            {task?.eventId?.progress}%
                          </span>
                        </div>

                        <div className="h-5 w-full rounded-full bg-[#ececf4]">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[#9d4edd] to-[#4361ee]"
                            style={{ width: `${task?.eventId?.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-5 flex justify-between p-3 border border-orange-400 rounded-2xl">
                    <div>
                      <p>Due Date:</p>
                      <span>
                        {new Date(task.selectDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => openTaskUpdateModal(task)}
                      className="flex gap-1 p-2 h-10 rounded-xl bg-linear-to-r from-[#ff6b00] to-[#fe9800] text-white"
                    >
                      <CircleCheck />
                      <span>start task</span>
                    </button>
                  </div>
                  </div>
                );
              })}
            </div>
          )}

          {openUpdateModal && selectedTask && (
            <UpdateTaskModal
              closeUpdateModal={closeUpdateModal}
              task={selectedTask}
            />
          )}
        </section>
        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pending;

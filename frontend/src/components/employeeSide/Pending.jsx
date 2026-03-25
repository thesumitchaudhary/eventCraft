import React, { useState } from "react";
import { CircleCheck, Upload } from "lucide-react";
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

  const closeUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["showSigninEmployee"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/myTask"),
  });

  const pendingTasks =
    data?.employee?.tasks?.filter((task) => task.status !== "completed") || [];

  // console.log(pendingTasks);

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
          {pendingTasks.length === 0 ? (
            <div className="bg-gray-50 p-40 rounded-2xl grid place-items-center">
              <div>
                <CircleCheck className="text-green-500 h-20 w-30" />
                No pending tasks!
              </div>
            </div>
          ) : (
            <div>
              {pendingTasks.map((task) => (
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
                      </div>
                    </div>
                    <p className="text-gray-400">
                      {/* Arrange floral decorations for the Johnson wedding at Grand
                  Hotel */}
                      {task.taskDescription}
                    </p>
                  </div>

                  <div className=" p-2 mt-4 h-10 bg-[#faf5ff] rounded-md border border-purple-500">
                    <div>
                      <p className="grid grid-cols-2">
                        <span className="text-gray-600">
                          Event:{" "}
                          <span className="text-black ">
                            {task?.eventId?.eventName}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Progress:{" "}
                          <span className="text-blackl text-purple-600 font-medium">
                            0%
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col my-4 bg-[#eff6ff] p-2 rounded-2xl">
                    <span className="text-gray-600 font-bold text-xs">
                      Work Updates:
                    </span>
                    <span className="text-gray-400">
                      Floral arrangements ordered. Setting up stage decorations.
                    </span>
                  </div>
                  <div className="my-5 flex justify-between">
                    <div>
                      <p>Due Date:</p>
                      <span>
                        {new Date(task.selectDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setOpenUpdateModal(true)}
                      className="flex p-2 h-10 rounded-xl bg-black text-white"
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
            </div>
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

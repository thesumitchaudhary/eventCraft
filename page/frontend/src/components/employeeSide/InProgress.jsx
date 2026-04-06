import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";
import UpdateTaskModal from "./popupModals/UpdateTaskModal";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const InProgress = () => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const closeUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const { data } = useQuery({
    queryKey: ["showSigninEmployeeAndItAssignTasks"],
    queryFn: () => fetcher(`http://localhost:4041/api/employee/myTask`),
  });

  // console.log(data?.employee?.tasks?.map((task) => task.status))
  const inProgress =
    data?.employee?.tasks?.filter((task) => task.status !== "completed") || [];

  console.log(inProgress);

  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          {inProgress.length === 0 ? (
            <div className="bg-gray-50 p-40 rounded-2xl grid place-items-center">
              <div>
                <CircleCheck className="text-green-500 h-20 w-30" />
                No pending tasks!
              </div>
            </div>
          ) : (
            <div>
              {inProgress.map((task) => {
                return (
                  <div key={task._id} className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{task.taskTitle}</h4>
                      <span className="text-xs p-1  rounded-2xl">
                        {task.priority === "Medium" ? (
                          <span className="bg-[#fef9c2] text-[#90550b] p-1 rounded-md px-5">
                            Medium
                          </span>
                        ) : task.priority === "High" ? (
                          <span className="text-red-500 bg-red-200 px-5">
                            High
                          </span>
                        ) : (
                          <span className="bg-[#dbfce7] text-[#157441] px-5">
                            Low
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span>{task.taskDescription}</span>
                    </div>
                    <div className="flex flex-col p-4 bg-blue-50 mt-5 rounded-2xl">
                      <h5 className="text-blue-900 font-bold">
                        Latest Update:
                      </h5>
                      <span className="text-blue-600">
                        Floral arrangements ordered. Setting up stage
                        decorations.
                      </span>
                    </div>
                    <div className="flex justify-between mt-5">
                      <span>
                        Due: {new Date(task.selectDate).toLocaleDateString()}
                      </span>
                      <button onClick={()=> setOpenUpdateModal(true)} className="bg-black text-white p-2 rounded-2xl">
                        Update Progress
                      </button>
                    </div>
                    {openUpdateModal && <UpdateTaskModal closeUpdateModal={closeUpdateModal}/>}
                  </div>
                );
              })}
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

export default InProgress;

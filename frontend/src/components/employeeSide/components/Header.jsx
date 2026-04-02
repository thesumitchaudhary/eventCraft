import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Settings,
  LogOut,
  ClipboardList,
  Clock4,
  CircleAlert,
  CircleCheck,
} from "lucide-react";

import ProfileModal from "../popupModals/ProfileModal";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4041/api";

const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/employee/logout`, {
    method: "GET",
    credentials: "include",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message || "Logout failed");
  }

  return body;
};

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const Header = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const navigate = useNavigate();

  const closeProfileModal = () => {
    setOpenProfileModal(false);
  };

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  const { data } = useQuery({
    queryKey: ["employeeDetails"],
    queryFn: () => fetcher(`${BASE_URL}/employee/me`),
  });

  // console.log(data?.employee);

  //   const { data } = useQuery({
  //   queryKey: ["employeeDetails"],
  //   queryFn: () => fetcher(`${BASE_URL}/employee/me`),
  // });

  const { data: data1 } = useQuery({
    queryKey: ["showSigninEmployee"],
    queryFn: () => fetcher(`http://localhost:4041/api/employee/myTask`),
  });

  const progessTasks =
    data1?.employee?.tasks?.filter((task) => task.status === "in-progress") ||
    [];

  console.log(progessTasks.length);

  return (
    <>
      <header className="h-fit w-full ">
        <div className="flex justify-between border-b border-gray-300 bg-gray-50 h-17 pt-6 pb-15">
          <div className="pl-8">
            <div className=" flex gap-2">
              <Calendar className="text-purple-500" />
              <h1>Employee Portal</h1>
            </div>
            <p className="mx-8">
              Welcome, {data?.employee?.userId?.firstname}{" "}
              {data?.employee?.userId?.lastname}
            </p>
          </div>
          <div className="flex gap-5 pr-9">
            <button
              onClick={() => setOpenProfileModal(true)}
              className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 min-h-sm border border-gray-300"
            >
              <Settings className="" />
              <span>Profile</span>
            </button>
            {openProfileModal && (
              <ProfileModal closeProfileModal={closeProfileModal} />
            )}
            <button
              onClick={() => logoutMutation.mutate()}
              className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 border border-gray-300"
            >
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="flex gap-5 my-10 mx-5">
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10 border border-gray-300 border-l-6 border-l-gray-600">
            <div className="flex gap-1">
              <ClipboardList className="max-h-5 max-w-4 font-semibold text-gray-600" />
              <p>Total Tasks</p>
            </div>
            <h1 className="text-xl font-bold text-gray-600">2</h1>
          </div>
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10 border border-gray-300 border-l-6 border-l-[#f54a00]">
            <div className="flex gap-1">
              <Clock4 className="max-h-5 max-w-4 font-semibold" />
              <p>Pending</p>
            </div>
            <div className="flex gap-3">
              <h1 className="text-xl font-bold text-[#f54a00]">0</h1>
              {data1?.employee?.tasks?.filter(
                (task) => task.status === "pending",
              ).length === 1 ? (
                <span className="bg-[#f54a00] text-white rounded-3xl p-1 w-25 text-xs font-semibold animate-pulse">
                  Action Needed
                </span>
              ) : (
                <span></span>
              )}
            </div>
          </div>
          <div
            className={`bg-gray-50 min-w-72 rounded-2xl p-10 border border-gray-300 border-l-6 border-l-[#155dfc]`}
          >
            <div className="flex gap-1">
              <CircleAlert className="max-h-5 max-w-4 font-semibold" />
              <p>In Progress</p>
            </div>
            <div className="flex gap-2">
              <h1 className="text-xl font-bold text-[#155dfc]">
                {" "}
                {
                  data1?.employee?.tasks?.filter(
                    (task) => task.status === "in-progress",
                  ).length
                }
              </h1>
              {data1?.employee?.tasks?.filter(
                (task) => task.status === "in-progress",
              ).length === 1 ? (
                <span className="bg-[#0000f5] text-white rounded-3xl p-1 w-25 text-xs font-semibold animate-pulse">
                  Action Needed
                </span>
              ) : (
                <span></span>
              )}
            </div>
          </div>
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10 border border-gray-300 border-l-6 border-l-[#00a63e]">
            <div className="flex gap-1">
              <CircleCheck className="max-h-5 max-w-4 font-semibold" />
              <p>Completed</p>
            </div>
            <h1 className="text-xl font-bold text-[#00a63e]">
              {
                data1?.employee?.tasks?.filter(
                  (task) => task.status === "completed",
                ).length
              }
            </h1>
          </div>
        </div>

        <div className="">
          <nav className="my-10 mx-7 max-w-max">
            <ul className="flex rounded-xl bg-[#e3e3e8] p-1">
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/employee/Dashboard"}
              >
                <ClipboardList className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">All Tasks</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 relative px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/employee/Pending"}
              >
                {data1?.employee?.tasks?.filter(
                  (task) => task.status === "pending",
                ).length === 1 ? (
                  <span className="absolute bg-[#f54a00] animate-pulse rounded-full h-2 w-2 left-25 top-1"></span>
                ) : (
                  <span></span>
                )}

                <Clock4 className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">
                  Pending
                  {data1?.employee?.tasks?.filter(
                    (task) => task.status === "pending",
                  ).length === 1 ? (
                    <span>(1)</span>
                  ) : (
                    <span>(0)</span>
                  )}
                </span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 relative px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/employee/InProgress"}
              >
                {data1?.employee?.tasks?.filter(
                  (task) => task.status === "in-progress",
                ).length === 1 ? (
                  <span className="absolute bg-[#f54a00] animate-pulse rounded-full h-2 w-2 left-31 top-1"></span>
                ) : (
                  <span></span>
                )}
                <CircleAlert className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">
                  In Progress
                  {data1?.employee?.tasks?.filter(
                    (task) => task.status === "in-progress",
                  ).length === 1 ? (
                    <span>(1)</span>
                  ) : (
                    <span>(0)</span>
                  )}
                </span>
              </NavLink>
              <NavLink
                to={"/employee/Completed"}
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
              >
                <CircleCheck className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">
                  Completed
                  {data1?.employee?.tasks?.filter(
                    (task) => task.status === "completed",
                  ).length === 1 ? (
                    <span>(1)</span>
                  ) : (
                    <span>(0)</span>
                  )}
                </span>
              </NavLink>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;

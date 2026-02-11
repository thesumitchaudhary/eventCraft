import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Settings,
  LogOut,
  ClipboardList,
  Clock4,
  CircleAlert,
  CircleCheck,
} from "lucide-react";

const API_URL = import.meta.env.VITE_EMPLOYEE_BACKEND_URL;

const logoutUser = async () => {
  const navigate = useNavigate();

  const res = await fetch(`${API_URL}/logout`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
};

const Header = () => {
  const logoutMutation = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      // console.log("success");
      navigate("/");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  return (
    <>
      <header className="h-fit w-full ">
        <div className="flex justify-between border-b border-gray-300 bg-gray-50 h-17 pt-6 pb-15">
          <div className="pl-8">
            <div className=" flex gap-2">
              <Calendar className="text-purple-500" />
              <h1>Employee Portal</h1>
            </div>
            <p className="mx-8">Welcome, Sarah Johnson</p>
          </div>
          <div className="flex gap-5 pr-9">
            <button className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 min-h-sm border border-gray-300">
              <Settings className="" />
              <span>Profile</span>
            </button>
            <button
              // onClick={() => logoutMutation.mutate()}
              className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 border border-gray-300"
            >
              <Link to={"/"}>
              <LogOut />
              <span>Logout</span>
              </Link>
            </button>
          </div>
        </div>

        <div className="flex gap-5 my-10 mx-5">
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10">
            <p className="text-center">Total Tasks</p>
            <h1 className="text-center text-xl font-bold">2</h1>
          </div>
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10">
            <p className="text-center">Pending</p>
            <h1 className="text-center text-xl font-bold">0</h1>
          </div>
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10">
            <p className="text-center">In Progress</p>
            <h1 className="text-center text-xl font-bold">1</h1>
          </div>
          <div className="bg-gray-50 min-w-72 rounded-2xl p-10">
            <p className="text-center">Completed</p>
            <h1 className="text-center text-xl font-bold">1</h1>
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
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/employee/Pending"}
              >
                <Clock4 className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Pending</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/employee/InProgress"}
              >
                <CircleAlert className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">In Progress(1)</span>
              </NavLink>
              <NavLink
                to={"/employee/Completed"}
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
              >
                <CircleCheck
                  CircleAlert
                  className="max-h-5 max-w-4 font-semibold"
                />
                <span className="text-sm font-medium">Completed(1)</span>
              </NavLink>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;

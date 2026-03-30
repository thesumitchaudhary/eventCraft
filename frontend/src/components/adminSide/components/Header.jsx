import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Settings,
  LogOut,
  ChartColumn,
  Palette,
  TrendingUp,
  Users,
  CircleUser,
  ClipboardList,
  CalendarRange,
  DollarSign,
} from "lucide-react";
import ProfileModal from "../popupmodals/ProfileModal";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_BACKEND_URL;
console.log(API_URL)

// this is for get admin details
const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};


// this is for logout admin
const logoutAdmin = async() =>{
  const res = await fetch(`${API_URL}/admin/logout`,{
    method:"GET",
    credentials:"include"
  });

  if(!res.ok){
    throw new Error(res.message || "Request Failed");
  }

  return await res.json();
}

const Header = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const navigate = useNavigate();

  const closeProfileModel = () => {
    setOpenProfileModal(false);
  };

  // this is for the get details of the admin
  const { data } = useQuery({
    queryKey: ["adminInformation"],
    queryFn: () => fetcher("http://localhost:4041/api/admin/me"),
  });

  // console.log(data?.admin?.userId.firstname)

  //this is for admin logout
  const logoutAdminMutation = useMutation({
    mutationFn: () => logoutAdmin(),
    onSuccess: () =>{
     navigate("/")
    },
    onError: (error) =>{
      console.log("error", error)
    }
  })

  return (
    <>
      <header className="h-fit w-full ">
        <div className="flex justify-between border-b border-gray-300 bg-gray-50 h-17 pt-6 pb-15">
          <div className="pl-8">
            <div className=" flex gap-2">
              <Calendar className="text-purple-500" />
              <h1>Admin Portal</h1>
            </div>
            <p className="mx-8">Welcome, {data?.admin?.userId.firstname} {data?.admin?.userId.lastname}

            </p>
          </div>
          <div className="flex gap-5 pr-9">
            <button
              onClick={(e) => setOpenProfileModal(true)}
              className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 min-h-sm border border-gray-300"
            >
              <Settings className="" />
              <span>Profile</span>
            </button>
            {openProfileModal && (
              <ProfileModal closeProfileModel={closeProfileModel} />
            )}
            <button onClick={(e) => logoutAdminMutation.mutate()} className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 border border-gray-300">     
                <LogOut />
                <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="">
          <nav className="my-10 mx-7 max-w-max">
            <ul className="flex rounded-xl bg-[#e3e3e8] p-1">
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-2 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/admin/Dashboard"}
              >
                <ChartColumn className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Overview</span>
              </NavLink>
              <NavLink
                to={"/admin/Analytics"}
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
              >
                <TrendingUp className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Analytics</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/admin/Customers"}
              >
                <Users className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">customer</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/admin/Bookings"}
              >
                <Calendar className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Bookings</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/admin/AddTheme"}
              >
                <Palette className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Add Themes</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/admin/Employees"}
              >
                <CircleUser className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Employees</span>
              </NavLink>
              <NavLink
                to={"/admin/Tasks"}
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
              >
                <ClipboardList className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Tasks</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/admin/Revenue"}
              >
                <DollarSign className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Revenue</span>
              </NavLink>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;

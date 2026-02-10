import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Settings,
  LogOut,
  ChartColumn,
  TrendingUp,
  Users,
  CircleUser,
  ClipboardList,
  CalendarRange,
  DollarSign,
} from "lucide-react";
import ProfileModal from "../popupmodals/ProfileModal";

const Header = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const closeProfileModel = () => {
    setOpenProfileModal(false)
  };
  return (
    <>
      <header className="h-fit w-full ">
        <div className="flex justify-between border-b border-gray-300 bg-gray-50 h-17 pt-6 pb-15">
          <div className="pl-8">
            <div className=" flex gap-2">
              <Calendar className="text-purple-500" />
              <h1>Customer Portal</h1>
            </div>
            <p className="mx-8">Welcome, Chaudhary sumit</p>
          </div>
          <div className="flex gap-5 pr-9">
            <button onClick={(e) => setOpenProfileModal(true)} className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 min-h-sm border border-gray-300">
              <Settings className="" />
              <span>Profile</span>
            </button>
            {openProfileModal && <ProfileModal closeProfileModel={closeProfileModel}/>}
            <button className="flex gap-1 hover:bg-gray-200 rounded-md py-1 px-3 h-8 w-28 border border-gray-300">
              <Link className="flex gap-1" to={"/"}>
                <LogOut />
                <span>Logout</span>
              </Link>
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

import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Settings,
  LogOut,
  TrendingUp,
  Palette,
  CreditCard,
  Image,
  Star,
  CircleQuestionMark,
  MessageCircle,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import ProfileModal from "../popupmodals/ProfileModal";

const API_URL = import.meta.env.VITE_CUSTOMER_BACKEND_URL;

const fetcher = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

const logoutUser = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json;
};

const Header = () => {
  const [openProfileModal, setOpenProfileModel] = useState(false);
  const [openLiveModal, setOpenLiveModal] = useState(false);

  useEffect(() => {
    if (openProfileModal || openLiveModal) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [openProfileModal, openLiveModal]);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["details"],
    queryFn: () => fetcher("http://localhost:4041/api/customer/me"),
  });

  const closeProfileModal = () => {
    setOpenProfileModel(false);
  };

  const logoutMutation = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      // console.log("success");
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <header className=" border-b h-fit w-full border-gray-200">
        <div className="bg-gray-50 h-17 my-5">
          <div className="mx-8 flex gap-2">
            <Calendar className="text-purple-500" />
            <h1>Customer Portal</h1>
          </div>
          {isLoading ? (
            <p className="mx-8"> loading... </p>
          ) : (
            <p className="mx-8">
              Welcome, {data?.user?.firstName} {data?.user?.lastName}
            </p>
          )}
        </div>
        <div className="absolute top-5 left-237 flex gap-5">
          <div className="relative">
            <sup className="absolute left-10 bg-red-500 py-3 px-2 rounded-md text-md text-white font-bold">
              2
            </sup>
            <Bell className=" h-9 w-15 rounded-md hover:bg-gray-200 border border-gray-300 p-2" />
          </div>
          <div
            onClick={(e) => setOpenProfileModel(true)}
            className="flex gap-1 hover:bg-gray-200 rounded-md p-1 border border-gray-300"
          >
            <Settings className="h-7 w-9 p-1" />
            <span>Profile</span>
          </div>
          {openProfileModal && (
            <ProfileModal closeProfileModal={closeProfileModal} />
          )}
          <button
            onClick={(e) => logoutMutation.mutate()}
            className="flex gap-1 hover:bg-gray-200 rounded-md p-1 border border-gray-300"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
        <div className="">
          <nav className="my-10 mx-7 max-w-max">
            <ul className="flex rounded-xl bg-[#e3e3e8] p-1">
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-2 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/customerDashboard"}
              >
                <TrendingUp className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Overview</span>
              </NavLink>
              <NavLink
                to={"/MyBookings"}
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
              >
                <Calendar className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">My Bookings</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/EventThemes"}
              >
                <Palette className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Event Themes</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/Payments"}
              >
                <CreditCard className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">payments</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/Gallery"}
              >
                <Image className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Gallery</span>
              </NavLink>
              <NavLink
                to={"/Reviews"}
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
              >
                <Star className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">Reviews</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex gap-2 px-3 py-2 rounded-xl transition ${isActive ? "bg-white text-black shadow" : "hover:bg-gray-200"}`
                }
                to={"/FAQ"}
              >
                <CircleQuestionMark className="max-h-5 max-w-4 font-semibold" />
                <span className="text-sm font-medium">FAQ</span>
              </NavLink>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;

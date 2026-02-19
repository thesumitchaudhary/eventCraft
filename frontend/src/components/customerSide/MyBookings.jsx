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
  Plus,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

import EventRegistrationModal from "./popupmodals/EventRegistrationModal";

const MyBookings = () => {
  const [openEventModel, setOpenEventModel] = useState(false);

  useEffect(() => {
    if (openEventModel) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [openEventModel]);

  // for close EventRegistration modal
  const close = () => {
    setOpenEventModel(false);
  };

  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main className="min-h-3xl">
        <section className="mx-5">
          <div className="flex justify-between">
            <h1 className="font-bold text-xl">My Event Bookings</h1>
            <button
              onClick={(e) => {
                setOpenEventModel(true);
              }}
              className="bg-black rounded-xl text-white p-2 flex"
            >
              <Plus /> New Booking
            </button>
            {openEventModel && <EventRegistrationModal close={close} />}
          </div>
          <div className="left-4 p-2 my-4 rounded-xl w-310 bg-gray-50">
            <div className="flex justify-between">
              <div className="">
                <h2 className="font-bold text-xl">Johnson Wedding</h2>
                <p>Wedding - Classic Elegant</p>
              </div>
              <div className="flex gap-3 mt-4">
                <span className=" bg-black max-h-max max-w-max px-3 text-xs rounded-md text-white">
                  in-progress
                </span>
                <span className="bg-[#dbeafe] max-h-max max-w-max px-4 text-xs rounded-md text-[#193cba]">
                  partial
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 my-3">
              <div>
                <span>Date</span>
                <p>2026-02-14</p>
              </div>
              <div>
                <span>Venue</span>
                <h3>Grand Hotel Ballroom</h3>
              </div>
            </div>
            <div className="grid grid-cols-4 my-3">
              <div>
                <span>Guest Count</span>
                <h3>200 guests</h3>
              </div>
              <div>
                <span>Budgets</span>
                <p>$50,000</p>
              </div>
            </div>
            <div className="">
              <div className="relative">
                <p>Event Progress</p>
                <p className="">90%</p>
                <div className="max-w-7xl h-3 border border-black rounded-xl overflow-hidden">
                  <div className="h-full bg-black" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="left-4 p-2 my-4 rounded-xl w-310 bg-gray-50">
            <div className="flex justify-between">
              <div className="">
                <h2 className="font-bold text-xl">Johnson Wedding</h2>
                <p>Wedding - Classic Elegant</p>
              </div>
              <div className="flex gap-3 mt-4">
                <span className=" bg-black max-h-max max-w-max px-3 text-xs rounded-md text-white">
                  in-progress
                </span>
                <span className="bg-[#dbeafe] max-h-max max-w-max px-4 text-xs rounded-md text-[#193cba]">
                  partial
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 my-3">
              <div>
                <span>Date</span>
                <p>2026-02-14</p>
              </div>
              <div>
                <span>Venue</span>
                <h3>Grand Hotel Ballroom</h3>
              </div>
            </div>
            <div className="grid grid-cols-4 my-3">
              <div>
                <span>Guest Count</span>
                <h3>200 guests</h3>
              </div>
              <div>
                <span>Budgets</span>
                <p>$50,000</p>
              </div>
            </div>
            <div className="">
              <div className="relative">
                <p>Event Progress</p>
                <p className="">70%</p>
                <div className="max-w-7xl h-3 border border-black rounded-xl overflow-hidden">
                  <div className="h-full bg-black" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="left-4 p-2 my-4 rounded-xl w-310 bg-gray-50">
            <div className="flex justify-between">
              <div className="">
                <h2 className="font-bold text-xl">Johnson Wedding</h2>
                <p>Wedding - Classic Elegant</p>
              </div>
              <div className="flex gap-3 mt-4">
                <span className=" bg-black max-h-max max-w-max px-3 text-xs rounded-md text-white">
                  in-progress
                </span>
                <span className="bg-[#dbeafe] max-h-max max-w-max px-4 text-xs rounded-md text-[#193cba]">
                  partial
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 my-3">
              <div>
                <span>Date</span>
                <p>2026-02-14</p>
              </div>
              <div>
                <span>Venue</span>
                <h3>Grand Hotel Ballroom</h3>
              </div>
            </div>
            <div className="grid grid-cols-4 my-3">
              <div>
                <span>Guest Count</span>
                <h3>200 guests</h3>
              </div>
              <div>
                <span>Budgets</span>
                <p>$50,000</p>
              </div>
            </div>
            <div className="">
              <div className="relative">
                <p>Event Progress</p>
                <p className="">80%</p>
                <div className="max-w-7xl h-3 border border-black rounded-xl overflow-hidden">
                  <div className="h-full bg-black" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-end mr-4">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;

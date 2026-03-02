import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

import EventRegistrationModal from "./popupmodals/EventRegistrationModal";
import MakePaymentModal from "./popupmodals/MakePaymentModal";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  if (!res.ok) {
    throw new Error("There was a problem");
  }

  return res.json();
};

const MyBookings = () => {
  const [openEventModel, setOpenEventModel] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

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

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetcher("http://localhost:4041/api/index/my-booking"),
  });

  console.log({ data });

  // for close EventRegistration modal
  const close = () => {
    setOpenEventModel(false);
  };

  // for close payment modal
  const closePaymentModal = () => {
    setOpenPaymentModal(false);
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
            {data?.data?.map((booking) => (
              <div key={booking.id} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-xl">{booking.eventName}</h2>
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
                    <p>{new Date(booking.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span>Venue</span>
                    <h3>{booking.venue}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-4 my-3">
                  <div>
                    <span>Guest Count</span>
                    <h3>{booking.guestCount} guests</h3>
                  </div>
                  <div>
                    <span>Budgets</span>
                    <p>{booking.totalAmount}</p>
                  </div>
                </div>
                <div className="">
                  <div className="relative">
                    <p>Event Progress</p>
                    <p className="">90%</p>
                    <div className="max-w-7xl h-3 border border-black rounded-xl overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{ width: "90%" }}
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-4" />
                <div className="flex justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Payment</span>
                    <span className="font-semibold text-sm">
                      $0 / $50,000
                    </span>
                  </div>
                  <button
                    onClick={(e) => setOpenEventModel(true)}
                    className="bg-black p-2"
                  >
                    <span className="text-white">Make Payment</span>
                  </button>
                  {openPaymentModal && (
                    <MakePaymentModal closePaymentModal={closePaymentModal} />
                  )}
                </div>
              </div>
            ))}
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

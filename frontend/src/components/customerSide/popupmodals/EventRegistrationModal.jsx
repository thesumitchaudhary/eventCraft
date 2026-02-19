import React, { useState, useEffect, useContext } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { EventContext } from "../../../context/EventContext";

const API_URL_EVENT_BOOKING = import.meta.env
  .VITE_CUSTOMER_EVENT_BOOKING_BACKEND_URL;

const EventBooking = async ({
  eventName,
  eventType,
  selectTheme,
  date,
  venue,
  guestCount,
  budget,
}) => {
  const res = await fetch(`${API_URL_EVENT_BOOKING}/createEvent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      eventName,
      eventType,
      theme: selectTheme,
      eventDate: date,
      venue,
      guestCount: Number(guestCount),
      totalAmount: Number(budget),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Event booking failed");
  }

  return res.json();
};

const EventRegistrationModal = ({ close }) => {
  const {
    eventName,
    setEventName,
    eventType,
    setEventType,
    selectTheme,
    setSelectTheme,
    date,
    setDate,
    venue,
    setVenue,
    guestCount,
    setGuestCount,
    budget,
    setBudget,
  } = useContext(EventContext);

  const eventBookingMutation = useMutation({
    mutationFn: () =>
      EventBooking({
        eventName,
        eventType,
        selectTheme,
        date,
        venue,
        guestCount,
        budget,
      }),
    onSuccess: (data) => {
      console.log("Booking Success:", data);
      close(); // ✅ auto close modal
    },
    onError: (error) => {
      console.error("Booking Error:", error.message);
    },
  });

  return (
    <>
      <div className="z-1">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={close}
        />

        <div
          className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                max-w-xl w-full
                bg-white rounded-2xl p-4 z-50"
        >
          <div className="flex justify-between my-4 mx-1">
            <div>
              <h1 className="text-xl font-bold">Create New Event Booking</h1>
              <p className="text-sm">Fill in the details for your event</p>
            </div>
            <button onClick={close}>
              <X />
            </button>
          </div>
          <div className="flex gap-10 my-2 mx-2">
            <div className="flex flex-col">
              <label className="font-medium my-1">Event Name</label>
              <input
                type="text"
                className="border border-gray-400 min-h-7 pl-1"
                placeholder="e.g., Johnson Wedding"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium my-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                name="Select Type"
                className="border border-gray-400 text-gray-500 focus:text-gray-900 py-1 min-w-50"
              >
                <option value="Select Type">Select Type</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col my-2 mx-2">
            <label className="font-medium my-1">Select Theme</label>
            <select
            disabled={!eventType}
              value={selectTheme}
              onChange={(e) => setSelectTheme(e.target.value)}
              name="Select a Theme"
              className="border border-gray-400 text-gray-500 focus:text-gray-900 py-1"
            >
              <option value="Select a Theme">Select a Theme</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Birthday">Birthday</option>
              <option value="id">4</option>
              <option value="id">5</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-5 my-4">
            <div className="flex flex-col">
              <label className="font-medium"> Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-400 p-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Venue</label>
              <input
                type="text"
                className="border border-gray-400 p-1"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Grand Hotel"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5 my-4">
            <div className="flex flex-col">
              <label className="font-medium">Guest Count</label>
              <input
                type="number"
                className="border"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="Number of guests"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Budget ($)</label>
              <input
                type="number"
                className="border"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Total budget"
              />
            </div>
          </div>
          <button
            disabled={eventBookingMutation.isPending}
            onClick={() => eventBookingMutation.mutate()}
            className="border w-full p-1 rounded-md disabled:opacity-50"
          >
            {eventBookingMutation.isPending ? "Booking..." : "Create Booking"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EventRegistrationModal;

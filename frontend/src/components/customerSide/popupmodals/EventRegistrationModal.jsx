import React, { useState, useEffect, useContext } from "react";
import { X } from "lucide-react";
import { Select, TextInput, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useQuery, useMutation } from "@tanstack/react-query";

import { EventContext } from "../../../context/EventContext";

const API_URL_EVENT_BOOKING = import.meta.env
  .VITE_CUSTOMER_EVENT_BOOKING_BACKEND_URL;

const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
};

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
      eventDate: date ? dayjs(date).format("YYYY-MM-DD") : null,
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

  const [focusedEventname, setFocusedEventname] = useState(false);
  const [focusedDate, setFocusedDate] = useState(false);
  const [focusedVenue, setFocusedVenue] = useState(false);
  const [focusedGuestCount, setFocusedGuestCount] = useState(false);
  const [focusedBudget, setFocusedBudget] = useState(false);
  const [focusedEventType, setFocusedEventType] = useState(false);
  const [focusedSelectTheme, setFocusedSelectTheme] = useState(false);

  const floatingEventname = focusedEventname || eventName?.length > 0;
  const floatingDate = focusedDate || !!date;
  const floatingVenue = focusedVenue || venue?.length > 0;
  const floatingGuestCount = focusedGuestCount || guestCount?.length > 0;
  const floatingBudget = focusedBudget || budget?.length > 0;
  const floatingEventType = focusedEventType || eventType?.length > 0;
  const floatingSelectTheme = focusedSelectTheme || selectTheme?.length > 0;

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
      close();
    },
    onError: (error) => {
      console.error("Booking Error:", error.message);
    },
  });

  const { data: themesData = [], isPending, isLoading,isError, error } = useQuery({
    queryKey: ["eventThemesDetails", API_URL],
    enabled: Boolean(API_URL), 
    queryFn: () => fetcher(`${API_URL}/admin/getAllEventTheme`),
    select: (response) => {
      // normalize possible backend shapes
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.data)) return response.data;
      if (Array.isArray(response?.themes)) return response.themes;
      return [];
    },
  });

  // Optional debug
  // console.log("API_URL:", API_URL);
  // console.log("themesData:", themesData);
  // if (isError) console.error("themes query error:", error);

  // Safe options for Mantine Select (must always have string value)
  const eventTypeOptions = [
    ...new Map(
      themesData
        .filter(
          (item) =>
            typeof item?.eventType === "string" && item.eventType.trim() !== ""
        )
        .map((item) => [
          item.eventType,
          { value: item.eventType, label: item.eventType },
        ])
    ).values(),
  ];

  const themeOptions = themesData
    .filter(
      (item) =>
        item?.eventType === eventType &&
        typeof item?.theme === "string" &&
        item.theme.trim() !== ""
    )
    .map((item) => ({ value: item.theme, label: item.theme }));

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
              <TextInput
                label="Event Name"
                placeholder={focusedEventname ? "e.g. Johnson Wedding" : ""}
                value={eventName}
                onChange={(e) => setEventName(e.currentTarget.value)}
                onFocus={() => setFocusedEventname(true)}
                onBlur={() => setFocusedEventname(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingEventname
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div className="flex flex-col">
              <Select
                value={eventType}
                onChange={setEventType}
                label="Select Type"
                placeholder={focusedEventType ? "Select Type" : ""}
                data={isLoading ? [] : eventTypeOptions}
                onFocus={() => setFocusedEventType(true)}
                onBlur={() => setFocusedEventType(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingEventType
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col my-3 mx-2">
            {
              <Select
                disabled={!eventType}
                value={selectTheme}
                onChange={setSelectTheme}
                label="Select Theme"
                placeholder={focusedSelectTheme ? "Select Theme" : ""}
                data={themeOptions}
                onFocus={() => setFocusedSelectTheme(true)}
                onBlur={() => setFocusedSelectTheme(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingSelectTheme
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            }
          </div>
          <div className="grid grid-cols-3 gap-5 my-4">
            <div className="flex flex-col">
              <DateInput
                clearable
                value={date}
                onChange={setDate}
                defaultValue={dayjs().toDate()}
                label="Select Date"
                placeholder={focusedDate ? "yyyy-mm-dd" : ""}
                onFocus={() => setFocusedDate(true)}
                onBlur={() => setFocusedDate(false)}
                classNames={{
                  root: "relative mt-3",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 pointer-events-none text-sm text-gray-400 transition-all duration-150 ${
                    focusedDate || date
                      ? "-translate-y-5 text-xs text-gray-900"
                      : "top-2"
                  }`,
                }}
              />
            </div>
            <div className="flex flex-col">
              <TextInput
                label="Venue"
                placeholder={focusedVenue ? "e.g. Grand Hotel" : ""}
                value={venue}
                onChange={(e) => setVenue(e.currentTarget.value)}
                onFocus={() => setFocusedVenue(true)}
                onBlur={() => setFocusedVenue(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingVenue ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5 my-4">
            <div className="flex flex-col">
              <TextInput
                type="number"
                label="Guest Count"
                placeholder={focusedGuestCount ? "Guest Count" : ""}
                value={guestCount}
                onChange={(e) => setGuestCount(e.currentTarget.value)}
                onFocus={() => setFocusedGuestCount(true)}
                onBlur={() => setFocusedGuestCount(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingGuestCount
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div className="flex flex-col">
              <TextInput
                type="number"
                label="Budget ($)"
                placeholder={focusedBudget ? "Budget" : ""}
                value={budget}
                onChange={(e) => setBudget(e.currentTarget.value)}
                onFocus={() => setFocusedBudget(true)}
                onBlur={() => setFocusedBudget(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingBudget ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
          </div>
          <Button
            disabled={eventBookingMutation.isPending}
            onClick={() => eventBookingMutation.mutate()}
            className="border w-full p-1 rounded-md disabled:opacity-50"
          >
            {eventBookingMutation.isPending ? "Booking..." : "Create Booking"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EventRegistrationModal;

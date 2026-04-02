import React, { useState } from "react";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Menu, ActionIcon } from "@mantine/core";
import { EllipsisVertical } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LiveIcon from "./components/LiveIcon";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const updateEventBookStatus = async (id, bookingStatus) => {
  const res = await fetch(`${API_URL}/admin/updateStatus/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      bookingStatus,
    }),
  });

  if (!res.ok) {
    throw new Error("there was a problem so you can't update eventbook action");
  }

  return res.json();
};

const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include",
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body;
};

const Bookings = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["showbookings"],
    queryFn: async () =>
      await fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  // console.log(data?.customers?.map((data) => data?.events));
  // console.log(data?.customers?.flatMap((customer) => customer))
  // console.log(data?.customers?.flatMap((customer) => customer?.events.map((booking)=> booking.bookingStatus === "accepted")).filter((isAccepted) => isAccepted).length)
  // console.log(data?.customers?.flatMap((customer) => customer?.events.map((booking)=> booking.bookingStatus === "accepted")).filter(Boolean).length)
  // console.log(data?.customers?.flatMap((customer) => customer?.events.map((booking)=> booking.progress !== 0)).filter(Boolean).length)


  const eventBookActionMutation = useMutation({
    mutationFn: ({ id, bookingStatus }) =>
      updateEventBookStatus(id, bookingStatus),
    onSuccess: (data) => {
      console.log("success", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // 🔍 Flatten + Filter bookings
  const allBookings =
    data?.customers?.flatMap((customer) => customer?.events) || [];

  const filteredBookings = allBookings.filter((booking) => {
    const value = search.toLowerCase();

    return (
      booking.eventName?.toLowerCase().includes(value) ||
      booking.eventType?.toLowerCase().includes(value) ||
      booking.theme?.toLowerCase().includes(value) ||
      booking.venue?.toLowerCase().includes(value) ||
      booking.bookingStatus?.toLowerCase().includes(value) ||
      booking.paymentStatus?.toLowerCase().includes(value) ||
      booking.guestCount?.toString().includes(value)
    );
  });

  return (
    <div className="bg-[#ececec]">
      <Header />

      <main>
        {/* HEADER */}
        <section className="my-10 mx-5">
          <div className="flex justify-between items-center">
            <div>
              <h1>Booking Management</h1>
              <p>
                Total bookings:{" "}
                {allBookings.length}
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex items-center border px-2 rounded min-w-90 bg-white">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                className="w-full px-2 py-1 outline-none"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="my-10 mx-5">
          <div className="flex gap-5 flex-wrap">
            <div className="min-w-55 p-5 rounded-2xl bg-gray-50 border border-gray-300 border-l-6 border-l-[#6a7282]">
              <p className="text-center">Pending</p>
              <h3 className="text-center text-2xl font-bold text-[#6a7282]">
                {
                  allBookings.filter(
                    (b) => b.bookingStatus === "pending"
                  ).length
                }
              </h3>
            </div>

            <div className="min-w-55 p-5 rounded-2xl bg-gray-50 border border-gray-300 border-l-6 border-l-[#fd0d0d]">
              <p className="text-center">Rejected</p>
              <h3 className="text-center text-2xl font-bold text-[#fd0d0d]">
                {
                  allBookings.filter(
                    (b) => b.bookingStatus === "rejected"
                  ).length
                }
              </h3>
            </div>

            <div className="min-w-55 p-5 rounded-2xl bg-gray-50 border border-gray-300 border-l-6 border-l-[#155dfc]">
              <p className="text-center">Confirmed</p>
              <h3 className="text-center text-2xl font-bold text-[#155dfc]">
                {
                  allBookings.filter(
                    (b) => b.bookingStatus === "accepted"
                  ).length
                }
              </h3>
            </div>

            <div className="min-w-55 p-5 rounded-2xl bg-gray-50 border border-gray-300 border-l-6 border-l-[#f54a00]">
              <p className="text-center">In Progress</p>
              <h3 className="text-center text-2xl font-bold text-[#f54a00]">
                {
                  allBookings.filter((b) => b.progress !== 0).length
                }
              </h3>
            </div>

            <div className="min-w-55 p-5 rounded-2xl bg-gray-50 border border-gray-300 border-l-6 border-l-[#00a63e]">
              <p className="text-center">Completed</p>
              <h3 className="text-center text-2xl font-bold text-[#00a63e]">
                {
                  allBookings.filter(
                    (b) => b.bookingStatus === "completed"
                  ).length
                }
              </h3>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-300">
            <table className="w-full my-4 border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-black text-left">
                  <th className="py-2 px-2">Event Name</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Theme</th>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Venue</th>
                  <th className="py-2 px-2">Guests</th>
                  <th className="py-2 px-2">Budget</th>
                  <th className="py-2 px-2">Payment</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Progress</th>
                  <th className="py-2 px-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      loading...
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-black">
                      <td className="py-2 px-2">{booking.eventName}</td>
                      <td className="py-2 px-2">{booking.eventType}</td>
                      <td className="py-2 px-2">{booking.theme}</td>
                      <td className="py-2 px-2">
                        {new Date(
                          booking.eventDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2">{booking.venue}</td>
                      <td className="py-2 px-2">{booking.guestCount}</td>
                      <td className="py-2 px-2">{booking.totalAmount}</td>
                      <td className="py-2 px-2">
                        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-medium">
                        {booking.progress}%
                      </td>

                      <td className="py-2 px-2 font-medium flex flex-col">
                        <Menu>
                          <Menu.Target>
                            <ActionIcon variant="transparent">
                              <EllipsisVertical size={18} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              onClick={() =>
                                eventBookActionMutation.mutate({
                                  id: booking._id,
                                  bookingStatus: "rejected",
                                })
                              }
                            >
                              Reject
                            </Menu.Item>

                            <Menu.Item
                              onClick={() =>
                                eventBookActionMutation.mutate({
                                  id: booking._id,
                                  bookingStatus: "accepted",
                                })
                              }
                            >
                              Accept
                            </Menu.Item>

                            <Menu.Item
                              onClick={() =>
                                eventBookActionMutation.mutate({
                                  id: booking._id,
                                  bookingStatus: "completed",
                                })
                              }
                            >
                              Completed
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </td>
                    </tr>
                  ))}

                {/* NO RESULTS */}
                {!isLoading && filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Bookings;
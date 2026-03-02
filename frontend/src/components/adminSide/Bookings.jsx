import React from "react";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Menu, ActionIcon } from "@mantine/core";
import { EllipsisVertical } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

const API_URL = import.meta.env.VITE_BACKEND_URL;
// console.log(API_URL)

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
  const id = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["showbookings"],
    queryFn: async () =>
      await fetcher("http://localhost:4041/api/index/my-booking"),
  });

  const eventBookActionMutation = useMutation({
    mutationFn: ({ id, bookingStatus }) =>
      updateEventBookStatus(id, bookingStatus),
    onSucess: (data) => {
      console.log("succes", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return (
    <div className="bg-[#ececec]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex justify-between">
            <div>
              <h1>Booking Management</h1>
              <p>Total bookings: 2</p>
            </div>
            <div className="flex">
              <Search className="border h-10 w-10 p-1" />
              <input type="text" className="border" placeholder="Search" />
            </div>
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="flex gap-5">
            <div className="min-w-70 p-5 rounded-3xl bg-gray-50 border border-gray-300">
              <p className="text-center">Pending</p>
              <h3 className="text-center text-2xl font-bold">0</h3>
            </div>
            <div className="min-w-70 p-5 rounded-3xl bg-gray-50 border border-gray-300">
              <p className="text-center">Confirmed</p>
              <h3 className="text-center text-2xl font-bold">0</h3>
            </div>
            <div className="min-w-70 p-5 rounded-3xl bg-gray-50 border border-gray-300">
              <p className="text-center">In Progress</p>
              <h3 className="text-center text-2xl font-bold">1</h3>
            </div>
            <div className="min-w-70 p-5 rounded-3xl bg-gray-50 border border-gray-300">
              <p className="text-center">Completed</p>
              <h3 className="text-center text-2xl font-bold">1</h3>
            </div>
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-300">
            <table className="w-full my-4 border-collapse text-sm">
              <thead>
                <tr className="border-b border-black text-left">
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
                {data?.data?.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-300">
                    <td className="py-2 px-2">{booking.eventName}</td>
                    <td className="py-2 px-2">{booking.eventType}</td>
                    <td className="py-2 px-2">{booking.theme}</td>
                    <td className="py-2 px-2">
                      {new Date(booking.eventDate).toLocaleDateString()}
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
                    <td className="py-2 px-2 font-medium">60%</td>
                    <td className="py-2 px-2 font-medium flex flex-col">
                      <Menu>
                        <Menu.Target>
                          <ActionIcon
                            variant="transparent"
                            aria-label="More options"
                          >
                            <EllipsisVertical
                              className="text-black"
                              size={18}
                            />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={(e) =>
                              eventBookActionMutation.mutate({
                                id: booking._id,
                                bookingStatus: "rejected",
                              })
                            }
                          >
                            Reject
                          </Menu.Item>
                          <Menu.Item
                            onClick={(e) =>
                              eventBookActionMutation.mutate({
                                id: booking._id,
                                bookingStatus: "accepted",
                              })
                            }
                          >
                            Accept
                          </Menu.Item>
                          <Menu.Item
                            onClick={(e) =>
                              eventBookActionMutation.mutate({
                                id: booking._id,
                                bookingStatus: "completed",
                              })
                            }
                          >
                            Completed
                          </Menu.Item>

                          {/* Other items ... */}
                        </Menu.Dropdown>
                      </Menu>
                    </td>
                  </tr>
                ))}
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

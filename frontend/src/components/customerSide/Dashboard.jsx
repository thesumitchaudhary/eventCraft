import React, { useState } from "react";
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
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// this is for import pages
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

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

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async() => await fetcher("http://localhost:4041/api/index/my-booking"),
  });

// console.log("query data:", data);
// console.log("query error:", error);

  return (
    <div className="bg-[#eeeeef] min-h-screen relative">
      <Header />

      <main>
        <section className="max-w-max mx-auto">
          <div className="flex gap-4">
            <div className="w-99 border p-6 bg-gray-50 border-gray-300 rounded-xl">
              <p>Total Bookings</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
            <div className="w-99 border p-6 bg-gray-50 border-gray-300 rounded-xl">
              <p>Upcoming Events</p>
              <h3 className="text-2xl font-bold">1</h3>
            </div>
            <div className="w-99 border p-6 bg-gray-50 border-gray-300 rounded-xl">
              <p>Total Spent</p>
              <h3 className="text-2xl font-bold">$40,000</h3>
            </div>
          </div>
        </section>
        <section className="max-w-6xl  my-10 mx-auto bg-gray-50 rounded-xl border border-gray-300">
          <div className="p-5">
            <div>
              <h2 className="font-bold">Recent Bookings</h2>
              <p>Your latest event bookings</p>
            </div>
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-2">Event</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Theme</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Progress</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}

                {data?.data?.map((booking) => (
                  <tr key={booking._id} className="border-b border-black">
                    <td className="py-2">{booking.eventName}</td>
                    <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                    <td>{booking.theme}</td>
                    <td>{booking.bookingStatus}</td>
                    <td>
                      {booking.bookingStatus === "completed" ? "100%" : "60%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Dashboard;

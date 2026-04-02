import React from "react";
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
import { NavLink, Link } from "react-router-dom";
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
  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () =>
      await fetcher("http://localhost:4041/api/index/my-booking"),
  });

  console.log("query data:", data);
  // console.log("query error:", error);

  return (
    <div className="bg-[#eeeeef] min-h-screen relative">
      <Header />

      <main>
        <section className="max-w-max mx-auto">
          <div className="flex gap-4">
            <div className="w-99 border p-6 bg-gray-50 border-gray-300 rounded-2xl border-l-6 border-l-[#9810fa]">
              <p className="text-center">Total Bookings</p>
              <p className="text-2xl font-semibold text-center text-[#9810fa]">
                {data?.events.length}
              </p>
            </div>
            <div className="w-99 border p-6 bg-gray-50 border-gray-300 rounded-2xl border-l-6 border-l-[#f54a00]">
              <p className="text-center">Upcoming Events</p>
              <p className="text-2xl font-semibold text-center text-[#f54a00]">
                {
                  data?.events.filter(
                    (event) => event.bookingStatus == "accepted",
                  ).length
                }
              </p>
            </div>
            <div className="w-99 border p-6 bg-gray-50 border-gray-300 rounded-2xl border-l-6 border-l-[#00a63e]">
              <p className="text-center">Total Spent</p>
              <p className="text-2xl font-semibold text-center text-[#00a63e]">
                ${" "}
                {data?.events.reduce(
                  (total, event) => total + event.totalPaid,
                  0,
                )}
              </p>
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
                <tr className="border-b-2 border-black text-left">
                  <th className="py-2">Event</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Theme</th>
                  <th className="py-2">
                    Status for Conformation <br /> from Admin
                  </th>
                  <th className="py-2">
                    Status for work update <br /> from employee
                  </th>
                  <th className="py-2">Work Progress</th>
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

                {data?.events?.map((booking) => (
                  <tr key={booking._id} className="border-b border-black">
                    <td className="py-2">{booking.eventName}</td>
                    <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                    <td>{booking.theme}</td>
                    <td>
                      {" "}
                      <span className="text-xs font-semibold text-white bg-gray-600 p-1 rounded-md">
                        {" "}
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-white bg-black p-1 rounded-md">
                        {booking.progress !== 0 ? "in-progress" : "pending"}
                      </span>
                    </td>
                    <td>{booking.progress}%</td>
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

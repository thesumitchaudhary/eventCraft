import React from "react";
import { Search } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Bookings = () => {
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
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-2">Event Name</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Theme</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Venue</th>
                  <th className="py-2">Guests</th>
                  <th className="py-2">Budget</th>
                  <th className="py-2">Payment</th>
                  <th className="py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Johnson Wedding
                  </td>
                  <td className="border-b border-gray-300 p-1">Wedding</td>
                  <td className="border-b border-gray-300 p-1">
                    {" "}
                    Classic Elegant
                  </td>
                  <td className="border-b border-gray-300 p-1">2026-02-14</td>
                  <td className="border-b border-gray-300 p-1">
                    Grand Hotel Ballroom
                  </td>
                  <td className="border-b border-gray-300 p-1">200</td>
                  <td className="border-b border-gray-300 p-1">$50,000</td>
                  <td className="border-b border-gray-300 p-1">
                    <span className="bg-black text-white text-xs p-1 rounded-md">
                      in-progress
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    <span className="bg-gray-500 text-xs p-1 rounded-md">
                      partial
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">60%</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Anniversary Celebration
                  </td>
                  <td className="border-b border-gray-300 p-1">Anniversary</td>
                  <td className="border-b border-gray-300 p-1">
                    Romantic Garden
                  </td>
                  <td className="border-b border-gray-300 p-1">2025-11-15</td>
                  <td className="border-b border-gray-300 p-1">
                    Rose Garden Restaurant
                  </td>
                  <td className="border-b border-gray-300 p-1">50</td>
                  <td className="border-b border-gray-300 p-1">$15,000</td>
                  <td className="border-b border-gray-300 p-1">
                    <span className="bg-black text-white text-xs p-1 rounded-md">
                      completed
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    <span className="bg-black text-white text-xs p-1 rounded-md">
                      completed
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;

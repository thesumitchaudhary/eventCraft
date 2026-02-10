import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Users, Calendar, CircleUser, DollarSign } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Dashboard = () => {
  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="mx-8 my-10">
          <div className="flex gap-4">
            <div className="min-w-2xs bg-gray-50 border p-10 rounded-2xl">
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-[#155dfc]" />
                <p className="text-[#7e7a82]">Total Customers</p>
              </div>
              <h4 className="text-3xl font-bold">1</h4>
            </div>
            <div className="min-w-2xs bg-gray-50 border p-10 rounded-2xl">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-[#9810fa]" />
                <p className="text-[#7e7a82]">Active Bookings</p>
              </div>
              <h4 className="text-3xl font-bold">1</h4>
            </div>
            <div className="min-w-2xs bg-gray-50 border p-10 rounded-2xl">
              <div className="flex gap-3">
                <CircleUser className="h-5 w-5 text-[#02a740]" />
                <p className="text-[#7e7a82]">Total Employees</p>
              </div>
              <h4 className="text-3xl font-bold">2</h4>
            </div>
            <div className="min-w-2xs bg-gray-50 border p-10 rounded-2xl">
              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-[#009966]" />
                <p className="text-[#7e7a82]">Total Revenue</p>
              </div>
              <h4 className="text-3xl font-bold">$40,000</h4>
            </div>
          </div>
        </section>
        <section className="mx-8 my-10">
          <div className="flex gap-15">
            <div className="bg-gray-50 min-w-140 rounded-2xl">
              <div>
                <div className="my-3 mx-4">
                  <h4 className="text-sm font-bold">Task Distribution</h4>
                </div>
                <div className="my-3 mx-4">
                  <p className="text-[#717182]">Overview of task status</p>
                </div>
                <div className="flex gap-10">
                  <div>
                    <p className="text-[#99a1af]">1</p>
                    <p className="text-[#4a5573]">pending</p>
                  </div>
                  <div>
                    <p className="text-[#155dfc]">1</p>
                    <p className="text-[#4a5573]">in progress</p>
                  </div>
                  <div>
                    <p className="text-[#00a63e]">1</p>
                    <p className="text-[#4a5573]">completed</p>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="bg-gray-50 flex flex-col gap-3 p-5 min-w-140 rounded-2xl">
              <div className="flex flex-col gap-1">
                <div>
                  <h2 className="text-sm font-bold">Revenue Summary</h2>
                </div>
                <div>
                  <p className="text-[#717182]">Payment status overview</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Received</span>
                  <span className="text-[#898989]">$40,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Amount</span>
                  <span>$25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expected</span>
                  <span>$65,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-8 my-7">
          <div className="bg-gray-50 rounded-2xl p-10">
            <div>
              <h2>Recent Bookings</h2>
              <p>Latest event bookings</p>
            </div>
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-2">Event Name</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Johnson Wedding
                  </td>
                  <td className="border-b border-gray-300 p-1">Wedding</td>
                  <td className="border-b border-gray-300 p-1">2026-02-14</td>
                  <td className="border-b border-gray-300 p-1">
                    <span className="bg-black text-white text-xs p-1 rounded-md">
                      in-progress
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">$25,000</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-300 p-1">
                    Johnson Wedding
                  </td>
                  <td className="border-b border-gray-300 p-1">Wedding</td>
                  <td className="border-b border-gray-300 p-1">2026-02-14</td>
                  <td className="border-b border-gray-300 p-1">
                    <span className="bg-black text-white text-xs p-1 rounded-md">
                      completed
                    </span>
                  </td>
                  <td className="border-b border-gray-300 p-1">$25,000</td>
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

export default Dashboard;

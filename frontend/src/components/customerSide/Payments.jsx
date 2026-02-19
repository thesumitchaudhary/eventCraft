import React, { useState } from "react";
import {
  Bell,
  Calendar,
  Settings,
  LogOut,
  Palette,
  CreditCard,
  Image,
  Star,
  CircleQuestionMark,
  TrendingUp,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

const Payments = () => {
  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main>
        <section className="min-h-50 max-w-6xl my-10 mx-auto bg-gray-50 rounded-xl border border-gray-300">
          <div className="p-5">
            <div>
              <h2 className="font-bold">Payment History</h2>
              <p>Track your event payments</p>
            </div>
            <table className="w-full my-3">
              <tr className="border-b p-2 border-black">
                <div>
                  <th className="flex justify-start">Event</th>
                </div>
                <th>Total Budget</th>
                <th>Amount Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              <tr className="border-b border-black">
                <td>Johnson Wedding</td>
                <td>$50,000</td>
                <td>$25,000</td>
                <td>$25,000</td>
                <td>parital</td>
                <td>Pay Now</td>
              </tr>
              <tr className="border-b border-black">
                <td>Anniversary Celebration</td>
                <td>$15,000</td>
                <td>$15,000</td>
                <td>$0</td>
                <td>completed</td>
                <td></td>
              </tr>
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

export default Payments;

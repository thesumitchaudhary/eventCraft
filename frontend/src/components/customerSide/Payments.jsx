import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// import file from header-footer componenets
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

import MakePaymentModal from "./popupmodals/MakePaymentModal";

const Payments = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const closePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main>
        <section className="min-h-50 max-w-6xl my-10 mx-auto bg-gray-50 rounded-sm border border-gray-300">
          <div className="p-5">
            <div>
              <h2 className="font-bold">Payment History</h2>
              <p>Track your event payments</p>
            </div>
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-2">Event</th>
                  <th className="py-2">Total Budget</th>
                  <th className="py-2">Amount Paid</th>
                  <th className="py-2">Remaining</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-black">
                  <td className="py-2">Johnson Wedding</td>
                  <td className="py-2">$50,000</td>
                  <td className="py-2">$25,000</td>
                  <td className="py-2">$25,000</td>
                  <td className="py-2 text-xs">
                    <span className="text-blue-800 font-medium rounded-sm bg-[#dbeafe] p-1">
                      partial
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={(e) => setOpenPaymentModal(true)}
                      className="text-black border border-gray-300 px-3 hover:bg-gray-200 py-2 rounded-xl"
                    >
                      <span className="text-xs font-bold">Pay Now</span>
                    </button>
                  </td>
                  {openPaymentModal && (
                    <MakePaymentModal closePaymentModal={closePaymentModal} />
                  )}
                </tr>

                <tr className="border-b border-black">
                  <td className="py-2">Anniversary Celebration</td>
                  <td className="py-2">$15,000</td>
                  <td className="py-2">$15,000</td>
                  <td className="py-2">$0</td>
                  <td className="py-2 text-xs">
                    <span className="text-green-800 font-medium rounded-sm bg-[#dbfce7] p-1">
                      completed
                    </span>
                  </td>
                  <td className="py-2"></td>
                </tr>
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

export default Payments;

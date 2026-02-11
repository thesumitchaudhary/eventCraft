import React from "react";
import { DollarSign, TrendingUp, FileText } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import RevenueByEventChart from "./components/charts/RevenueByEventChart";

const Revenue = () => {
  return (
    <div className="bg-[#ececec]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex gap-5">
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl">
              <p className="flex">
                <DollarSign className="text-[#00a63e]" />
                Total Employees
              </p>
              <h3>2</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl">
              <p className="flex">
                <TrendingUp className="text-[#f54a00]" />
                Active Tasks
              </p>
              <h3>2</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl">
              <p className="flex">
                <FileText className="text-[#155dfc]" />
                Completed Tasks
              </p>
              <h3>1</h3>
            </div>
          </div>
        </section>
        <section className="my-10 mx-5">
          <div>
            <RevenueByEventChart />
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5 rounded-2xl">
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

export default Revenue;

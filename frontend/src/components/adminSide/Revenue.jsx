import React from "react";
import { DollarSign, TrendingUp, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

import RevenueByEventChart from "./components/charts/RevenueByEventChart";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const Revenue = () => {
  const { data } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () => fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  console.log(data);

  // Calculate total revenue across all events
  const totalRevenue = data?.customers
    .flatMap((customer) => customer?.events || [])
    .reduce((total, event) => {
      const eventTotal = Array.isArray(event?.totalAmount)
        ? event.totalAmount.reduce((sum, amount) => sum + (amount || 0), 0)
        : event?.totalAmount || 0;
      return total + eventTotal;
    }, 0);

  const paidByCustomer = data?.customers
    ?.flatMap((c) => c?.events)
    ?.flatMap((eventDetail) => eventDetail?.totalPaid)
    ?.reduce((sum, val) => sum + val, 0);

  // remaining amount
  const remaining = (totalRevenue || 0) - paidByCustomer;

  return (
    <div className="bg-[#ececec]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex gap-5">
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300 border-l-6 border-l-[#00a63e]">
              <p className="flex">
                <DollarSign className="text-[#00a63e]" />
                Total Revenue
              </p>
              <h3 className="font-semibold text-2xl text-[#00a63e]">
                $ {paidByCustomer}
              </h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300 border-l-6 border-l-[#f54a00]">
              <p className="flex gap-1">
                <TrendingUp className="text-[#f54a00]" />
                Pending Amount
              </p>
              <h3 className="font-semibold text-2xl text-[#f54a00]">
                $ {remaining}
              </h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300 border-l-6 border-l-[#155dfc]">
              <p className="flex gap-1">
                <FileText className="text-[#155dfc]" />
                Total Expected
              </p>
              <h3 className="font-semibold text-2xl text-[#155dfc]">
                $ {totalRevenue}
              </h3>
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
            <h3 className="text-2xl font-bold">Payment Details</h3>
            <p>All bookings with payment information</p>
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-left">
                  <th className="py-2">Event Name</th>
                  <th className="py-2">Customer Name</th>
                  <th className="py-2">Budget</th>
                  <th className="py-2">Amount Paid</th>
                  <th className="py-2">Balance</th>
                  <th className="py-2">Payment Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.customers || []).flatMap((customer) =>
                  customer?.events.map((data) => (
                    <tr key={data._id} className="border-b border-black">
                      <td className="py-2 border-b p-1">{data.eventName}</td>
                      <td className="border-b p-1">{data?.eventType}</td>
                      <td className="border-b p-1">${data?.totalAmount}</td>
                      <td className="border-b p-1">
                        <span className="text-[#00a63e] font-bold">
                          {data?.totalPaid}
                        </span>
                      </td>
                      <td className="border-b p-1">
                        <span className="text-[#f54a00] font-bold">
                          {data?.totalAmount - data?.totalPaid}
                        </span>
                      </td>
                      <td className="border-b p-1">
                        {data?.paymentStatus === "partial" ? (
                          <span className="bg-[#dbeafe] text-[#193cba] text-xs p-1 rounded-md">Partial</span>
                        ) : (
                          <span className="bg-black text-white text-xs p-1 rounded-md">Pending</span>
                        )}
                      </td>
                      <td className="border-b p-1">
                        {new Date(data?.eventDate).toLocaleDateString()}
                      </td>
                    </tr>
                  )),
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

export default Revenue;

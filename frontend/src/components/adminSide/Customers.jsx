import React from "react";
import { Search } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LiveIcon from "./components/LiveIcon";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include",
  });

  const body = res.json();

  if (!res.ok) {
    throw new Error(body?.message || "Request Failed");
  }

  return body;
};

const Customers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () => fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  // console.log(data?.customers.flatMap((customer) => customer));

  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="my-5 mx-5 flex justify-between">
          <div>
            <h2>Customer Management</h2>
            <p>
              Total customers : <span className="font-semibold">{data?.customers.length}</span>
            </p>
          </div>
          <div className="flex">
            <Search className="h-7 w-7 p-1 border rounded-l" />
            <input className="border h-7" type="text" placeholder="Search" />
          </div>
        </section>
        <section className="my-5 mx-5">
          <div className="bg-gray-50 p-3 border border-gray-300 rounded-2xl">
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Address</th>
                  <th className="py-2">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {data?.customers.flatMap((customer) => (
                  <tr key={customer._id} className="border-b border-gray-300">
                    <td className="py-2 border-b border-gray-300 p-1">
                      {customer?.userId?.firstname} {customer?.userId?.lastname}
                    </td>
                    <td className="border-b border-gray-300 p-1">
                      {customer?.userId?.email}
                    </td>
                    <td className="border-b border-gray-300 p-1">
                      {customer?.phone}
                    </td>
                    <td className="border-b border-gray-300 p-1">
                      {customer?.address}
                    </td>
                    <td>
                      <span className="bg-black mx-5 rounded-md px-2 py-1 text-white">
                        {customer?.events.length}
                      </span>
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

export default Customers;

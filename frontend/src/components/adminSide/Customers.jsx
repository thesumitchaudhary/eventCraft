import React from "react";
import { Search } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Customers = () => {
  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="my-5 mx-5 flex justify-between">
          <div>
            <h2>Customer Management</h2>
            <p>Total customers: 1</p>
          </div>
          <div className="flex">
            <Search className="h-7 w-7 p-1 border rounded-l" />
            <input className="border h-7" type="text" placeholder="Search" />
          </div>
        </section>
        <section className="my-5 mx-5">
          <div className="bg-gray-50 p-3">
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Address</th>
                  <th className="py-2">Booking s</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 border-b border-gray-300 p-1">
                    John Doe
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    customer@example.com
                  </td>
                  <td className="border-b border-gray-300 p-1">+1234567891</td>
                  <td className="border-b border-gray-300 p-1">
                    123 Main St, New York, NY
                  </td>
                  <td>2</td>
                </tr>
                  <tr className="border-b border-gray-300">
                  <td className="py-2 border-b border-gray-300 p-1">
                    John Doe
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    customer@example.com
                  </td>
                  <td className="border-b border-gray-300 p-1">+1234567891</td>
                  <td className="border-b border-gray-300 p-1">
                    123 Main St, New York, NY
                  </td>
                  <td>2</td>
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

export default Customers;

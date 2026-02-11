import React, { useState } from "react";
import { UserPlus } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

import AddEmployeeModal from "./popupmodals/AddEmployeeModal";

const Employees = () => {
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);

  const closeAddEmployeeModal = () => {
    setOpenEmployeeModal(false);
  };
  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex justify-between">
            <h1>Employee Management</h1>
            <button
              onClick={(e) => setOpenEmployeeModal(true)}
              className="flex gap-1 bg-black text-white p-2 rounded-2xl"
            >
              <UserPlus className="h-4" />
              <span className="text-sm">Add Employee</span>
            </button>
            {openEmployeeModal && (
              <AddEmployeeModal closeAddEmployeeModal={closeAddEmployeeModal} />
            )}
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="flex gap-5">
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300">
              <p>Total Employees</p>
              <h3>2</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300">
              <p>Active Tasks</p>
              <h3>2</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300">
              <p>Completed Tasks</p>
              <h3>1</h3>
            </div>
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-2">
            <table className="w-full my-3 border-collapse">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Designation</th>
                  <th className="py-2">Joining Date</th>
                  <th className="py-2">Assigned Tasks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Sarah Johnson
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    employee@eventify.com
                  </td>
                  <td className="border-b border-gray-300 p-1">+1234567892</td>
                  <td className="border-b border-gray-300 p-1"></td>
                  <td className="border-b border-gray-300 p-1">
                    Event Coordinator
                  </td>
                  <td className="border-b border-gray-300 p-1">2024-01-15</td>
                  <td className="border-b border-gray-300 p-1">
                    <span>2</span>
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 border-b border-gray-300 p-1">
                    Mike Davis
                  </td>
                  <td className="border-b border-gray-300 p-1">
                    employee2@eventify.com
                  </td>
                  <td className="border-b border-gray-300 p-1">+1234567893</td>
                  <td className="border-b border-gray-300 p-1"></td>
                  <td className="border-b border-gray-300 p-1">Decorator</td>
                  <td className="border-b border-gray-300 p-1">2024-03-20</td>
                  <td className="border-b border-gray-300 p-1">
                    <span>1</span>
                  </td>
                </tr>
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

export default Employees;

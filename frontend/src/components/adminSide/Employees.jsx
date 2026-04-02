import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

import AddEmployeeModal from "./popupmodals/AddEmployeeModal";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Request Failed");
  }

  return body;
};

const Employees = () => {
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);

  const closeAddEmployeeModal = () => {
    setOpenEmployeeModal(false);
  };

  const { data } = useQuery({
    queryKey: ["showemployee"],
    queryFn: () => fetcher("http://localhost:4041/api/employee/findEmployee"),
  });

  // normalize response safely
  const users = Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
      ? data.users
      : [];
  const details = Array.isArray(data?.details) ? data.details : [];

  // merge users + details (match by userId if available, else by index)
  const employees = users.map((user, index) => {
    const detail =
      details.find((d) => d.userId === user._id || d.user?._id === user._id) ||
      details[index] ||
      {};

    return {
      ...user,
      ...detail,
    };
  });

  // console.log(users.map((user) => user.firstname));
  console.log(
    details.flatMap((detail) =>
      detail?.tasks?.map((taskDetail) => taskDetail).length),
    );


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
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300 border-l-6 border-l-[#9810fa]">
              <p className="text-center">Total Employees</p>
              <h3 className="font-semibold text-2xl text-center text-[#9810fa]">{employees.length}</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300 border-l-6 border-l-[#f54a00]">
              <p className="text-center">Active Tasks</p>
              <h3 className="font-semibold text-2xl text-center text-[#f54a00]">{employees?.tasks?.length || 0}</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl border border-gray-300 border-l-6 border-l-[#00a63e]">
              <p className="text-center">Completed Tasks</p>
              <h3 className="font-semibold text-2xl text-center text-[#00a63e]">1</h3>
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
                {employees?.length ? (
                  employees.map((employee, index) => (
                    <tr
                      key={employee?._id || employee?.userId || `emp-${index}`}
                      className="border-b border-black"
                    >
                      <td className="py-2 border-b border-gray-300 p-1">
                        {[employee?.firstname, employee?.lastname]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </td>
                      <td className="border-b border-gray-300 p-1">
                        {employee?.email || "N/A"}
                      </td>
                      <td className="border-b border-gray-300 p-1">
                        {employee?.phone || "N/A"}
                      </td>
                      <td className="border-b border-gray-300 p-1">
                        {employee?.designation || "Event Coordinator"}
                      </td>
                      <td className="border-b border-gray-300 p-1">
                        {employee?.joiningDate || "2024-01-15"}
                      </td>
                      <td className="border-b border-gray-300 p-1">
                        <span>{employee?.tasks.length}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 t ext-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
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

export default Employees;

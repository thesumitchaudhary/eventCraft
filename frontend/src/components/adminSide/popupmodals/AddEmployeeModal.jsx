import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { TextInput, Button, Input } from "@mantine/core";

import { Context } from "../../../context/Context";

const API_URL =
  import.meta.env.VITE_EMPLOYEE_BACKEND_URL ||
  "http://localhost:4041/api/employee";

const EmployeeCreate = async ({
  firstname,
  lastname,
  email,
  password,
  phone,
  designation,
}) => {
  try {
    const res = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        phone,
        designation,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const AddEmployeeModal = ({ closeAddEmployeeModal }) => {
  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    designation,
    setDesignation,
  } = useContext(Context);

  const [focusedFirstname, setFocusedFirstname] = useState(false);
  const [focusedLastname, setFocusedLastname] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [focusedPhone, setFocusedPhone] = useState(false);
  const [focusedDesignation, setFocusedDesignation] = useState(false);

  const floatingFirstname = focusedFirstname || firstname?.length > 0;
  const floatingLastname = focusedLastname || lastname?.length > 0;
  const floatingEmail = focusedEmail || email?.length > 0;
  const floatingPassword = focusedPassword || password?.length > 0;
  const floatingPhone = focusedPhone || phone?.length > 0;
  const floatingDesignation = focusedDesignation || designation?.length > 0;

  const employeeMutation = useMutation({
    mutationFn: () =>
      EmployeeCreate({
        firstname,
        lastname,
        email,
        password,
        phone,
        designation,
      }),
    onSuccess: (data) => {
      console.log("success", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return (
    <>
      <div>
        <div
          className="fixed left-0 right-0 bottom-0 top-0 bg-gray-200"
          onClick={close}
        ></div>
        <div className="fixed top-30 left-100 min-w-sm max-w-xl border border-gray-400 bg-white rounded-2xl p-2">
          <div className="flex justify-between">
            <div>
              <h1 className="text-base font-bold">Add New Employee</h1>
              <p>Create a new employee account</p>
            </div>
            <button onClick={closeAddEmployeeModal}>
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <TextInput
                label="First Name"
                placeholder={focusedFirstname ? "e.g. Johnson Employee" : ""}
                value={firstname}
                onChange={(e) => setFirstname(e.currentTarget.value)}
                onFocus={() => setFocusedFirstname(true)}
                onBlur={() => setFocusedFirstname(false)}
                classNames={{
                  root: "relative mt-1 mt-5",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingFirstname
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Last Name"
                placeholder={focusedLastname ? "e.g. Johnson Wedding" : ""}
                value={lastname}
                onChange={(e) => setLastname(e.currentTarget.value)}
                onFocus={() => setFocusedLastname(true)}
                onBlur={() => setFocusedLastname(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingLastname
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Email"
                placeholder={focusedEmail ? "employee@gmail.com" : ""}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                onFocus={() => setFocusedEmail(true)}
                onBlur={() => setFocusedEmail(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingEmail ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Password"
                placeholder={focusedPassword ? "employee@gmail.com" : ""}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                onFocus={() => setFocusedPassword(true)}
                onBlur={() => setFocusedPassword(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingPassword
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Phone"
                placeholder={focusedPhone ? "employee@gmail.com" : ""}
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
                onFocus={() => setFocusedPhone(true)}
                onBlur={() => setFocusedPhone(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingPhone ? "-translate-y-5 text-xs text-gray-900" : ""
                  }`,
                }}
              />
            </div>
            <div>
              <TextInput
                label="Designation"
                placeholder={focusedDesignation ? "employee@gmail.com" : ""}
                value={designation}
                onChange={(e) => setDesignation(e.currentTarget.value)}
                onFocus={() => setFocusedDesignation(true)}
                onBlur={() => setFocusedDesignation(false)}
                classNames={{
                  root: "relative mt-1",
                  input:
                    "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
                  label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
                    floatingDesignation
                      ? "-translate-y-5 text-xs text-gray-900"
                      : ""
                  }`,
                }}
              />
            </div>
            <div className="w-full my-1">
              <Button
                onClick={() => employeeMutation.mutate()}
                className="w-full"
                variant="filled"
                color="black"
              >
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeModal;

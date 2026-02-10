import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@mantine/core";
import { Button } from "@mantine/core";

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
        <div className="fixed top-35 left-100 min-w-sm max-w-xl border border-gray-400 bg-white rounded-2xl p-2">
          <div className="flex justify-between">
            <div>
              <h1 className="text-base font-bold">Add New Employee</h1>
              <p>Create a new employee account</p>
            </div>
            <button onClick={closeAddEmployeeModal}>
              <X />
            </button>
          </div>
          <div>
            <div>
              <label htmlFor="">Firstname</label>
              <Input
                placeholder="Enter Your firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Lastname</label>
              <Input
                placeholder="Enter Your lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <Input
                placeholder="Enter Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <Input
                placeholder="Enter Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Phone</label>
              <Input
                placeholder="Enter Your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Designation</label>
              <Input
                placeholder="Enter Your designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>
            <div className="w-full my-1">
              <Button
                onClick={(e) => employeeMutation.mutate()}
                className="w-full"
                variant="filled"
                color="black"
              >
                Button
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeModal;

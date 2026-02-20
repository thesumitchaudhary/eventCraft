import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { TextInput, Button } from "@mantine/core";

import { Context } from "../context/Context";

const API_URL = import.meta.env.VITE_CUSTOMER_BACKEND_URL;

const userCreate = async ({ firstname, lastname, email, password, phone }) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ firstname, lastname, email, password, phone }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log("Fetch error:", error);
    throw error;
  }
};

const verifyCode = async ({ code }) => {
  try {
    const res = await fetch(`${API_URL}/verifyEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) throw new Error("Internal server Error");
    return res.json();
  } catch (error) {
    console.log("Fetch error:", error);
    throw error;
  }
};

const SignupForm = () => {
  const navigate = useNavigate();

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
    otp,
    setOtp,
  } = useContext(Context);

  const [errorMessage, setErrorMessage] = useState("");
  const [showVerifyFunctionality, setShowVerifyFunctionality] = useState(false);

  const [focusedFirstname, setFocusedFirstname] = useState(false);
  const [focusedLastname, setFocusedLastname] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [focusedPhone, setFocusedPhone] = useState(false);
  const [focusedOtp, setFocusedOtp] = useState(false);

  const floatingFirstname = focusedFirstname || firstname?.length > 0;
  const floatingLastname = focusedLastname || lastname?.length > 0;
  const floatingEmail = focusedEmail || email?.length > 0;
  const floatingPassword = focusedPassword || password?.length > 0;
  const floatingPhone = focusedPhone || phone?.length > 0;
  const floatingOtp = focusedOtp || otp?.length > 0;

  const userMutation = useMutation({
    mutationFn: () =>
      userCreate({ firstname, lastname, email, password, phone }),
    onSuccess: () => {
      setErrorMessage("");
      setShowVerifyFunctionality(true);
    },
    onError: (error) => {
      console.log("error", error);
      setErrorMessage("Email already exists or another error occurred.");
    },
  });

  const codeMutation = useMutation({
    mutationFn: () => verifyCode({ code: otp }),
    onSuccess: () => {
      setErrorMessage("");
      navigate("/customerDashboard");
    },
    onError: (error) => {
      console.log("error", error);
      setErrorMessage("There was a problem verifying the code.");
    },
  });

  const handleSubmit = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    userMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-3">
      <TextInput
        label="FirstName"
        value={firstname}
        onChange={(e) => setFirstname(e.currentTarget.value)}
        onFocus={() => setFocusedFirstname(true)}
        onBlur={() => setFocusedFirstname(false)}
        classNames={{
          root: "relative mt-1",
          input:
            "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
          label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
            floatingFirstname ? "-translate-y-5 text-xs text-gray-900" : ""
          }`,
        }}
      />

      <TextInput
        label="LastName"
        value={lastname}
        onChange={(e) => setLastname(e.currentTarget.value)}
        onFocus={() => setFocusedLastname(true)}
        onBlur={() => setFocusedLastname(false)}
        classNames={{
          root: "relative mt-1",
          input:
            "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
          label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
            floatingLastname ? "-translate-y-5 text-xs text-gray-900" : ""
          }`,
        }}
      />

      <TextInput
        label="Email"
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

      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        onFocus={() => setFocusedPassword(true)}
        onBlur={() => setFocusedPassword(false)}
        classNames={{
          root: "relative mt-1",
          input:
            "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
          label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
            floatingPassword ? "-translate-y-5 text-xs text-gray-900" : ""
          }`,
        }}
      />

      <TextInput
        label="Phone"
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

      {showVerifyFunctionality && (
        <span className="text-sm font-bold">Verify Your OTP</span>
      )}

      {showVerifyFunctionality && (
        <TextInput
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.currentTarget.value)}
          onFocus={() => setFocusedOtp(true)}
          onBlur={() => setFocusedOtp(false)}
          classNames={{
            root: "relative mt-1",
            input:
              "bg-transparent border-0 border-b-2 border-gray-300 rounded-none px-0 pt-5 pb-1 focus:outline-none focus:border-gray-900",
            label: `absolute left-0 top-2 z-10 pointer-events-none text-sm font-normal text-gray-400 transition-all duration-100 ease-in-out ${
              floatingOtp ? "-translate-y-5 text-xs text-gray-900" : ""
            }`,
          }}
        />
      )}

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {!showVerifyFunctionality ? (
        <Button onClick={handleSubmit} className="border w-40 p-1 rounded-md">
          Create Account
        </Button>
      ) : (
        <Button
          onClick={() => codeMutation.mutate()}
          className="border w-40 p-1 rounded-md"
        >
          Verify OTP
        </Button>
      )}
    </div>
  );
};

export default SignupForm;

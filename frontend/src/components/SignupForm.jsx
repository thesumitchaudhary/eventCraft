import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@mantine/core";
import { Button } from "@mantine/core";

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
      body: JSON.stringify({
        code,
      }),
    });

    if (!res.ok) {
      throw new Error("Internal server Error");
    }
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

  const userMutation = useMutation({
    mutationFn: () =>
      userCreate({ firstname, lastname, email, password, phone }),
    onSuccess: (data) => {
      // console.log("User created", data);
      setErrorMessage("");
    },
    onError: (error) => {
      console.log("error", error);
      setErrorMessage("Email already exists or another error occurred."); // Set error message
    },
  });

  const CodeMutation = useMutation({
    mutationFn: () => verifyCode({ code: otp }),
    onSuccess: (data) => {
      // console.log("User created", data);
      setErrorMessage("");
      navigate("/customerDashboard");
    },
    onError: (error) => {
      console.log("error", error);
      setErrorMessage("There was problem in verification code"); // Set error message
    },
  });

  const handleSubmit = () => {
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    userMutation.mutate();
    setShowVerifyFunctionality(true);
  };

  return (
    <div className="w-100">
      {errorMessage && (
        <div className="error-message text-red-500">{errorMessage}</div>
      )}
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          className="border p-1 rounded-md"
          placeholder="Enter Your First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <Input
          type="text"
          className="border p-1 rounded-md"
          placeholder="Enter Your Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <Input
          type="email"
          className="border p-1 rounded-md"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          className="border p-1 rounded-md"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          type="number"
          className="border p-1 rounded-md"
          placeholder="Enter Your Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {showVerifyFunctionality && (
          <span className="text-sm font-bold">Verify Your OTP</span>
        )}
        {showVerifyFunctionality && (
          <Input
            type="password"
            className="border p-1 rounded-md"
            placeholder="Enter Your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        {showVerifyFunctionality === false ? (
          <Button onClick={handleSubmit} className="border w-40 p-1 rounded-md">
            Create Account
          </Button>
        ) : (
          <Button
            onClick={(e) => CodeMutation.mutate()}
            className="border w-40 p-1 rounded-md"
          >
            Verify OTP
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignupForm;

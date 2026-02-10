import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Context } from "../context/Context";
import { Input, Button } from "@mantine/core";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const loginUser = async ({ email, password, role }) => {
  const res = await fetch(`${BASE_URL}/${role}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};


const SigninForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const { email, setEmail, password, setPassword } = useContext(Context);

  // 🔑 ROLE decided by URL
  const role = location.pathname.startsWith("/admin")
    ? "admin"
    : location.pathname.startsWith("/employee")
      ? "employee"
      : "customer";

  const userMutation = useMutation({
    mutationFn: () => loginUser({ email, password, role }),
    onSuccess: () => {
      if (role === "admin") navigate("/admin/Dashboard");
      if (role === "employee") navigate("/employeeDashboard");
      if (role === "customer") navigate("/customerDashboard");
    },
    onError: () => {
      setErrorMessage("Invalid email or password");
    },
  });

  const handleSubmit = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    userMutation.mutate();
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col gap-3 w-80">
        <label>Email</label>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <Input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <Button
          onClick={handleSubmit}
          color="black"
          loading={userMutation.isPending}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SigninForm;

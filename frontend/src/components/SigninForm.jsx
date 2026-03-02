import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Context } from "../context/Context";
import { Button, TextInput } from "@mantine/core";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const loginUser = async ({ email, password, role }) => {
  const res = await fetch(`${BASE_URL}/${role}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
};

const SigninForm = () => {
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { email, setEmail, password, setPassword } = useContext(Context);

  const floatingEmail = focusedEmail || email.length > 0;
  const floatingPassword = focusedPassword || password.length > 0;

  const role = location.pathname.startsWith("/admin")
    ? "admin"
    : location.pathname.startsWith("/employee")
      ? "employee"
      : "customer";

  const userMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      setEmail("");
      setPassword("");
      if (role === "admin") navigate("/admin/Dashboard");
      if (role === "employee") navigate("/employeeDashboard");
      if (role === "customer") navigate("/customerDashboard");
    },
    onError: (err) => {
      setErrorMessage(err.message || "Invalid email or password");
    },
  });

  const handleSubmit = () => {
    const cleanEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    setErrorMessage("");
    userMutation.mutate({ email: cleanEmail, password, role });
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col gap-3 w-80">
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
          type="password"
          label="Password"
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

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <Button onClick={handleSubmit} color="black" loading={userMutation.isPending}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SigninForm;

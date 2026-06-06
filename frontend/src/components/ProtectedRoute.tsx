import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactElement;
  role?: "admin" | "employee" | "customer";
};

function isAuthorized(role?: string) {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    if (!role) return true;
    return user?.role === role;
  } catch (e) {
    return false;
  }
}

export default function ProtectedRoute({ children, role }: Props) {
  if (!isAuthorized(role)) return <Navigate to="/login" replace />;
  return children;
}

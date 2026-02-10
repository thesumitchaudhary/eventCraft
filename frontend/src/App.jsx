import React, { useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

// this is main dashboard of the website
import Dashboard from "./components/Dashboard";
// this is for the sign in and also sign up form for user,admin, and employee
import AuthModal from "./components/AuthModal";

// this is customer/user side of the website
import CustomerDashboard from "./components/customerSide/Dashboard";
import MyBookings from "./components/customerSide/MyBookings";
import EventThemes from "./components/customerSide/EventThemes";
import Payments from "./components/customerSide/Payments";
import Gallery from "./components/customerSide/Gallery";
import Reviews from "./components/customerSide/Reviews";
import FAQ from "./components/customerSide/FAQ";

// this is Admin side of the website
import AdminDashboard from "./components/adminSide/Dashboard";
import Analytics from "./components/adminSide/Analytics";
import Bookings from "./components/adminSide/Bookings";
import Customers from "./components/adminSide/Customers";
import Employees from "./components/adminSide/Employees";
import Revenue from "./components/adminSide/Revenue";
import Tasks from "./components/adminSide/Tasks";

// this is for employee side location  of the website
import EmployeeDashboard from "./components/employeeSide/Dashboard";
import Completed from "./components/employeeSide/Completed";
import InProgress from "./components/employeeSide/InProgress";
import Pending from "./components/employeeSide/Pending";

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Routes>
        {/* this is the main dashboard */}
        <Route path="/" element={<Dashboard />} />

        
      {/* auth (same UI, role decided by route) */}
      <Route path="/login" element={<AuthModal />} />
      <Route path="/admin/login" element={<AuthModal />} />
      <Route path="/employee/login" element={<AuthModal />} />

        {/* this routes for the customer side */}

        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/MyBookings" element={<MyBookings />} />
        <Route path="/EventThemes" element={<EventThemes />} />
        <Route path="/Payments" element={<Payments />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Reviews" element={<Reviews />} />
        <Route path="/FAQ" element={<FAQ />} />

        {/* this routes for the admin side */}
        <Route path="/admin/Dashboard" element={<AdminDashboard />} />
        <Route path="/admin/Analytics" element={<Analytics />} />
        <Route path="/admin/Bookings" element={<Bookings />} />
        <Route path="/admin/Customers" element={<Customers />} />
        <Route path="/admin/Employees" element={<Employees />} />
        <Route path="/admin/Revenue" element={<Revenue />} />
        <Route path="/admin/Tasks" element={<Tasks />} />

        <Route path="/Employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/Employee/Completed" element={<Completed />} />
        <Route path="/Employee/Completed" element={<Completed />} />

      </Routes>
    </>
  );
}

export default App;

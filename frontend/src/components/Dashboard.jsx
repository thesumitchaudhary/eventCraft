import React, { useState } from "react";
import AuthModal from "./AuthModal";
import {
  Calendar,
  Calendar as Calenders,
  MoveRight,
  Sparkles,
  Users,
  Heart,
  CircleCheckBig,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  const navigate = useNavigate();
  return (
    <>
      <div className="relative h-50">
        <header className="fixed top-0 z-50 h-20 w-full py-5 backdrop-blur-md bg-white/70 border-b border-gray-200">
          <div className="flex justify-between max-w-6xl mx-auto">
            <h1 className="flex gap-2">
              <Calendar className="text-[#9810fa] mt-1" />{" "}
              <span className="text-xl mt-1 font-bold">Eventify</span>
            </h1>
            <div className="flex gap-3">
              <Link to={"/admin/Dashboard"}>Admin</Link>
              <button
                onClick={(e) => {
                  setOpen(true);
                  setAuthMode("signin");
                }}
                className="hover:bg-gray-200 h-8 py-1 px-2 rounded-md flex gap-1"
              >
                Sign In
              </button>
              <button
                onClick={(e) => {
                  setOpen(true);
                  setAuthMode("signup");
                }}
                className="bg-black text-white h-8 py-1 px-2 rounded-md flex gap-1"
              >
                GetStart
              </button>
            </div>
          </div>
        </header>
      </div>
      {open && (
        <AuthModal open={open} setOpen={setOpen} defaultMode={authMode} />
      )}
      <main>
        <section className="flex flex-col gap-5 max-h-fit">
          <h2 className="text-6xl font-bold flex justify-center gap-3">
            Create Unforgettable
            <span className="font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          <p className="max-w-4xl mx-auto text-gray-600 text-lg text-center">
            From weddings to corporate events, we bring your vision to life with
            expert planning, seamless execution, and unforgettable experiences.
          </p>
          <div className="flex justify-center gap-10">
            <button
              onClick={(e) => {
                setOpen(true);
                setAuthMode("signup");
              }}
              className="bg-black text-white h-10 p-2 rounded-md font-medium flex gap-1"
            >
              Start Planning <MoveRight className="mt-0" />
            </button>
            <button
              onClick={(e) => {
                setOpen(true);
                setAuthMode("signin");
              }}
              className="border hover:bg-gray-200 font-medium h-10 border-gray-300 py-2 px-9 rounded-md flex gap-1"
            >
              Sign In
            </button>
          </div>
        </section>
        <section className="my-37 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="flex justify-center text-3xl font-bold">
              Why Choose Eventify?
            </h2>
            <p className="flex justify-center text-base text-gray-500">
              Everything you need to plan the perfect event
            </p>
          </div>
          <div className="mx-8 flex gap-5">
            <div className="border p-2 max-w-md border-gray-300 rounded-2xl">
              <Calenders className="mx-auto my-5 w-12 h-12 p-3 rounded-full bg-purple-100 text-[#9810fa]" />
              <h3 className="text-center my-2 font-semibold text-base">
                Easy Event Booking
              </h3>
              <p className="text-sm mx-7 text-center text-gray-500">
                Book your dream event in minutes with our streamlined process
              </p>
            </div>
            <div className="border p-2 max-w-md hover:shadow-lg border-gray-300  rounded-2xl">
              <Sparkles className="mx-auto my-5 w-12 h-12 p-3 rounded-full bg-purple-100 text-[#9810fa]" />
              <h3 className="text-center my-2 font-semibold">Custom Themes</h3>
              <p className="text-sm mx-7 text-center text-gray-500">
                Choose from a variety of beautiful themes tailored to your
                occasion
              </p>
            </div>
            <div className="border p-2 max-w-md border-gray-300 rounded-2xl">
              <Users className="mx-auto my-5 w-12 h-12 p-3 rounded-full bg-purple-100 text-[#9810fa]" />
              <h3 className="text-center my-2 font-semibold">Expert Team</h3>
              <p className="text-sm mx-7 text-gray-500 text-center">
                Professional event planners and staff dedicated to your event
              </p>
            </div>
            <div className="border p-2 max-w-md border-gray-300 rounded-2xl">
              <Heart className="mx-auto my-5 w-12 h-12 p-3 rounded-full bg-purple-100 text-[#9810fa]" />
              <h3 className="text-center my-2 font-semibold">
                Memorable Experiences
              </h3>
              <p className="text-sm mx-7 text-gray-500 text-center">
                Create unforgettable moments with our comprehensive event
                services
              </p>
            </div>
          </div>
        </section>
        <section className="my-16">
          <h2 className="flex justify-center mb-3 text-3xl font-bold">
            What You Get
          </h2>
          <p className="flex justify-center text-base text-gray-500">
            Comprehensive event management at your fingertips
          </p>
          <div className="flex justify-center mt-5 gap-25">
            <div className="flex flex-col gap-4">
              <p className="p-4 w-95 hover:bg-purple-50 rounded-2xl flex gap-2">
                <CircleCheckBig className="text-[#9810fa]" /> Real-time event
                tracking
              </p>
              <p className="p-4 w-95 hover:bg-purple-50 rounded-2xl flex gap-2">
                {" "}
                <CircleCheckBig className="text-[#9810fa]" /> Professional event
                coordination
              </p>
              <p className="p-4 w-95 hover:bg-purple-50 rounded-2xl flex gap-2">
                {" "}
                <CircleCheckBig className="text-[#9810fa]" /> Dedicated customer
                support
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="p-4 w-95 hover:bg-purple-50 rounded-2xl flex gap-2">
                <CircleCheckBig className="text-[#9810fa]" /> Flexible payment
                options
              </p>
              <p className="p-4 w-95 hover:bg-purple-50 rounded-2xl flex gap-2">
                <CircleCheckBig className="text-[#9810fa]" /> Customizable event
                packages
              </p>
              <p className="p-4 w-95 hover:bg-purple-50 rounded-2xl flex gap-2">
                <CircleCheckBig className="text-[#9810fa]" /> 100% satisfaction
                guarantee
              </p>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto my-20">
          <div className="p-10  rounded-2xl text-white bg-linear-to-r from-purple-500 to-blue-500">
            <h2 className="my-5 text-3xl font-bold flex justify-center">
              Ready to Get Started?
            </h2>
            <p className="flex my-5 justify-center">
              Join thousands of satisfied customers who trust us with their
              special events
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={(e) => {
                  setOpen(true);
                  setAuthMode("signup");
                }}
                className="bg-white text-black p-1 px-4 hover:bg-gray-500 font-bold text-[18px] rounded-md"
              >
                Create Account
              </button>
              <button
                onClick={(e) => {
                  setOpen(true);
                  setAuthMode("signin");
                }}
                className="border p-2 px-9 hover:bg-white hover:text-black border-white rounded-md"
              >
                Signin
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className=" bg-[#101828] p-10 text-white w-full">
        <div className="flex gap-40">
          <div className="w-70 flex flex-col gap-4">
            <h1 className="flex gap-3 text-xl font-semibold">
              <Calenders className="text-[#c27aff]" /> Eventify
            </h1>
            <p className="px-1 my-2 text-[#768ea7] text-base">
              Creating unforgettable moments through professional event
              management and planning services.
            </p>
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-[#1e2939] p-1 rounded-full">
                <Facebook className="h-8 w-8 rounded-full bg-[#1e2939] p-2" />
              </div>
              <div className="h-10 w-10 bg-[#1e2939] p-1 rounded-full">
                <Twitter className="h-8 w-8 rounded-full bg-[#1e2939] p-2" />
              </div>
              <div className="h-10 w-10 bg-[#1e2939] p-1 rounded-full">
                <Instagram className="h-8 w-8 rounded-full bg-[#1e2939] p-2" />
              </div>
              <div className="h-10 w-10 bg-[#1e2939] p-2 rounded-full">
                <Linkedin />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="text-[#768ea7] text-base my-7">
              <li>About us</li>
              <li>Our Services</li>
              <li>Portfolio</li>
              <li>Testimonials</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="text-[#768ea7] text-base">
              <li>Wedding Planning</li>
              <li>Corporate Events</li>
              <li>Birthday Parties</li>
              <li>Social Gatherings</li>
              <li>Special Occasions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">contact us</h3>
            <MapPin />
            <Phone />
            <Mail />
          </div>
        </div>
        <br />
        <hr />
        <div className="flex justify-between">
          <div>
            &copy; <span>2026 Eventify. All rights reserved.</span>
          </div>
          <div>
            <ul className="flex gap-5">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;

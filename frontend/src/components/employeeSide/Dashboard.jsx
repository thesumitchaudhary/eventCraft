import React from "react";
import { CircleAlert, Upload } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Dashboard = () => {
  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5 rounded-2xl grid grid-rows-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h1>Setup Wedding Venue Decorations</h1>
                <div className="flex gap-5">
                  <span className="text-sm text-red-500 bg-red-200 px-3 p-1 rounded-full">
                    high
                  </span>
                  <span className="text-sm ">in-progress</span>
                </div>
              </div>
              <p>
                Arrange floral decorations for the Johnson wedding at Grand
                Hotel
              </p>
            </div>
            <div className="grid grid-cols-3 mt-7">
              <div>
                <p>Created</p>
                <p className="font-bold text-xs">2026-01-15</p>
              </div>
              <div>
                <p>Due Date</p>
                <p className="font-bold text-xs">2026-01-25</p>
              </div>
              <div>
                <p>Priority</p>
                <p className="font-bold text-xs">high</p>
              </div>
            </div>
            <div className="flex flex-col my-4 bg-gray-100 p-2 rounded-2xl">
              <span className="text-gray-600 font-bold text-xs">
                Work Updates:
              </span>
              <span className="text-gray-400">
                Floral arrangements ordered. Setting up stage decorations.
              </span>
            </div>
            <div className="my-5 flex justify-end">
              <button className="flex p-2 rounded-2xl bg-black text-white">
                <Upload />
                <span>update Statues</span>
              </button>
            </div>
          </div>
        </section>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5 rounded-2xl grid grid-rows-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h1>Setup Wedding Venue Decorations</h1>
                <div className="flex gap-5">
                  <span className="text-sm text-red-500 bg-red-200 px-3 p-1 rounded-full">
                    high
                  </span>
                  <span className="text-sm ">in-progress</span>
                </div>
              </div>
              <p>
                Arrange floral decorations for the Johnson wedding at Grand
                Hotel
              </p>
            </div>
            <div className="grid grid-cols-3 mt-7">
              <div>
                <p>Created</p>
                <p className="font-bold text-xs">2026-01-15</p>
              </div>
              <div>
                <p>Due Date</p>
                <p className="font-bold text-xs">2026-01-25</p>
              </div>
              <div>
                <p>Priority</p>
                <p className="font-bold text-xs">high</p>
              </div>
            </div>
            <div className="flex flex-col my-4 bg-gray-100 p-2 rounded-2xl">
              <span className="text-gray-600 font-bold text-xs">
                Work Updates:
              </span>
              <span className="text-gray-400">
                Floral arrangements ordered. Setting up stage decorations.
              </span>
            </div>
            <div className="my-5 flex justify-end">
              <button className="flex p-2 rounded-2xl bg-black text-white">
                <Upload />
                <span>update Statues</span>
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

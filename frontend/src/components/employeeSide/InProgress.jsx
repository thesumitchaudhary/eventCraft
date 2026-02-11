import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const InProgress = () => {
  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex justify-between">
              <h4 className="font-bold">Setup Wedding Venue Decorations</h4>
              <span className="text-xs bg-red-300 text-red-500 p-1 px-5 rounded-2xl">
                high
              </span>
            </div>
            <div className="mt-2">
              <span>
                Arrange floral decorations for the Johnson wedding at Grand
                Hotel
              </span>
            </div>
            <div className="flex flex-col p-4 bg-blue-50 mt-5 rounded-2xl">
              <h5 className="text-blue-900 font-bold">Latest Update:</h5>
              <span className="text-blue-600">
                Floral arrangements ordered. Setting up stage decorations.
              </span>
            </div>
            <div className="flex justify-between mt-5">
              <span>Due: 2026-01-25</span>
              <button className="bg-black text-white p-2 rounded-2xl">Update Progress</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InProgress;

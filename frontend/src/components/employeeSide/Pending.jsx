import React from "react";
import { CircleCheck } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

const Pending = () => {
  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-40 rounded-2xl grid place-items-center">
            <div>
              <CircleCheck className="text-green-500 h-10" />
              No pending tasks!
            </div>
          </div>
        </section>
        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pending;

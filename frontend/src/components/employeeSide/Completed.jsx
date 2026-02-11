import React from "react";
import { CircleCheck } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Completed = () => {
  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="bg-green-50 p-5 border border-green-300 rounded-2xl">
            <div className="flex justify-between">
              <div>
                <h4>Birthday Party Entertainment Setup</h4>
              </div>
              <div className="bg-green-300 max-w-max px-3 p-1 rounded-2xl flex gap-1">
                <CircleCheck className="fill-green-300 text-green-400" />
                <span>Completed</span>
              </div>
            </div>
            <div className="mt-1">
              <span>
                Setup sound system and lighting for kids birthday party
              </span>
            </div>
            <div className="grid grid-rows-2 mt-4 bg-white p-2 rounded-2xl">
              <h5 className="text-2xs font-bold">Completion Notes:</h5>
              <span className="text-gray-600">
                All equipment tested and setup complemented successfully.
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Completed;

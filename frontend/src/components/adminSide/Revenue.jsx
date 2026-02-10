import React from "react";
import { DollarSign, TrendingUp, FileText } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Revenue = () => {
  return (
    <div className="bg-[#ececec]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="flex gap-5">
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl">
              <p className="flex">
                <DollarSign className="text-[#00a63e]" />
                Total Employees
              </p>
              <h3>2</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl">
              <p className="flex">
                <TrendingUp className="text-[#f54a00]" />
                Active Tasks
              </p>
              <h3>2</h3>
            </div>
            <div className="bg-gray-50 min-w-98 p-7 rounded-2xl">
              <p className="flex">
                <FileText className="text-[#155dfc]" />
                Completed Tasks
              </p>
              <h3>1</h3>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Revenue;

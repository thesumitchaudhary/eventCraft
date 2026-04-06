import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LiveIcon from "./components/LiveIcon";

import BarChartClickable from "./components/charts/BarChartClickable";
import CellPie from "./components/charts/CellPie";
import RevenueAreaChart from "./components/charts/RevenueAreaChart";

const Analytics = () => {
  return (
    <div className="bg-[#f0f1f3]">
      <Header />
      <main>
        <section className="flex gap-10 mx-5 my-10">
          <div className="bg-gray-50 p-10">
            <CellPie />
          </div>
          <div className="bg-gray-50">
            <BarChartClickable />
          </div>
        </section>
        <section className="w-full mx-5 my-10">
          <RevenueAreaChart />
        </section>
        <section className="flex justify-end mr-15">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;

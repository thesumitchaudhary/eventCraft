import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Dashboard = () => {
  return (
    <div className="bg-[#ededed]">
      <Header />
      <main>
        <section className="my-10 mx-5">
          <div className="bg-gray-50 p-5 rounded-2xl">
            <div>
              <h1>Setup Wedding Venue Decorations</h1>
              <p>
                Arrange floral decorations for the Johnson wedding at Grand
                Hotel
              </p>
            </div>
            <div>
              <span>High</span>
              <span>in-progress</span>
            </div>
            <div className="flex gap-10">
              <div>
                <p>Created</p>
                <p>2026-01-15</p>
              </div>
              <div>
                <p>Due Date</p>
                <p>2026-01-25</p>
              </div>
              <div>
                <p>Priority</p>
                <p>high</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";

import {
  Bell,
  Calendar,
  Settings,
  LogOut,
  TrendingUp,
  Palette,
  CreditCard,
  Image,
  Star,
  CircleQuestionMark,
} from "lucide-react";

import { NavLink, Link, useNavigate } from "react-router-dom";
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

const Reviews = () => {
  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main className="mx-5">
        <section className="bg-gray-50 p-5 rounded-2xl my-10">
          <div>
            <h4 className="font-bold">Customer Reviews</h4>
            <p className="text-gray-500 text-sm">
              Read what our customers have to say
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <div className="flex gap-2 justify-center m-3">
              <div className="flex mt-1">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex gap-2">
                <span className="text-2xl font-bold">4.8</span>
                <span className="mt-1">
                  (<span className="text-gray-600">6 reviews</span>)
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="border border-gray-300 hover:shadow-xl max-w-sm px-6 py-4 rounded-2xl">
              <div className="flex justify-between my-4">
                <div className="flex gap-3">
                  <span className="px-4 py-3 rounded-full bg-[#f3e8ff] text-purple-600">
                    SJ
                  </span>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-gray-600 text-sm">12/15/2025</p>
                  </div>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max p-2 rounded-3xl text-xs">
                  Wedding
                </span>
              </div>
              <div className="flex my-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-700">
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm px-6 py-4 rounded-2xl">
              <div className="flex justify-between my-4">
                <div className="flex gap-3">
                  <span className="px-4 py-3 rounded-full bg-[#f3e8ff] text-purple-600">
                    MC
                  </span>
                  <div>
                    <h3 className="font-semibold">Michael Chen</h3>
                    <p className="text-gray-600 text-sm">11/20/2025</p>
                  </div>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max p-2 rounded-3xl text-xs">
                  Corporate
                </span>
              </div>
              <div className="flex my-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-700">
                Our corporate event was a huge success thanks to Eventify.
                Highly recommended for any professional gathering.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm px-6 py-4 rounded-2xl">
              <div className="flex justify-between my-4">
                <div className="flex gap-3">
                  <span className="px-4 py-3 rounded-full bg-[#f3e8ff] text-purple-600">
                    ER
                  </span>
                  <div>
                    <h3 className="font-semibold">Emily Rodriguez</h3>
                    <p className="text-gray-600 text-sm">10/5/2025</p>
                  </div>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max p-2 rounded-3xl text-xs">
                  Birthday
                </span>
              </div>
              <div className="flex my-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-700">
                Best birthday party ever! My daughter was so happy. The
                decorations were stunning and everything ran smoothly.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm px-6 py-4 rounded-2xl">
              <div className="flex justify-between my-4">
                <div className="flex gap-3">
                  <span className="px-4 py-3 rounded-full bg-[#f3e8ff] text-purple-600">
                    DT
                  </span>
                  <div>
                    <h3 className="font-semibold">David Thompson</h3>
                    <p className="text-gray-600 text-sm">9/12/2025</p>
                  </div>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max p-2 rounded-3xl text-xs">
                  Anniversery
                </span>
              </div>
              <div className="flex my-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-700">
                Great experience overall. The team was responsive and delivered
                exactly what we asked for. Would definitely use again.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm px-6 py-4 rounded-2xl">
              <div className="flex justify-between my-4">
                <div className="flex gap-3">
                  <span className="px-4 py-3 rounded-full bg-[#f3e8ff] text-purple-600">
                    LA
                  </span>
                  <div>
                    <h3 className="font-semibold">Lisa Anderson</h3>
                    <p className="text-gray-600 text-sm">8/30/2025</p>
                  </div>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max p-2 rounded-3xl text-xs">
                  Wedding
                </span>
              </div>
              <div className="flex my-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-700">
                Exceptional service from start to finish. They understood our
                vision and brought it to life beautifully.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm px-6 py-4 rounded-2xl">
              <div className="flex justify-between my-4">
                <div className="flex gap-3">
                  <span className="px-4 py-3 rounded-full bg-[#f3e8ff] text-purple-600">
                    JW
                  </span>
                  <div>
                    <h3 className="font-semibold">James Wilson</h3>
                    <p className="text-gray-600 text-sm">7/18/2025</p>
                  </div>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max p-2 rounded-3xl text-xs">
                  Corporate
                </span>
              </div>
              <div className="flex my-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-700">
                Professional, creative, and reliable. Eventify exceeded all our
                expectations for our product launch event.s
              </p>
            </div>
          </div>
        </section>
        <section className="flex justify-end mr-4">
          <LiveIcon />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;

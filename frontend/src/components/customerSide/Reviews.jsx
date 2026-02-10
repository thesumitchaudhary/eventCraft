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

const Reviews = () => {
  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main className="mx-5">
        <section className="bg-gray-50 p-5 rounded-2xl">
          <div>
            <h2 className="text-lg font-bold">Customer Reviews</h2>
            <p className="text-gray-500 text-sm">
              Read what our customers have to say
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <h3>What Our Customers Say</h3>
            <div className="flex gap-2">
              <Star className="text-yellow-500 fill-yellow-500" />
              <Star className="text-yellow-500 fill-yellow-500" />
              <Star className="text-yellow-500 fill-yellow-500" />
              <Star className="text-yellow-500 fill-yellow-500" />
              <Star className="text-yellow-500 fill-yellow-500" />
              <div className="flex gap-2">
                <h4>4.8</h4>
                <span>(6 reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="border border-gray-300 hover:shadow-xl max-w-sm py-6 rounded-2xl">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-full bg-blue-300">SJ</div>
                <div>
                  <h3>Sarah Johnson</h3>
                  <p>12/15/2025</p>
                </div>
                <span className="bg-gray-50 border border-gray-300 max-w-3xs max-h-max rounded-3xl text-xs">
                  Wedding
                </span>
              </div>
              <div className="flex gap-1">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <p>
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm py-6 rounded-2xl">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-full bg-blue-300">SJ</div>
                <div>
                  <h3>Sarah Johnson</h3>
                  <p>12/15/2025</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <p>
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm py-6 rounded-2xl">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-full bg-blue-300">SJ</div>
                <div>
                  <h3>Sarah Johnson</h3>
                  <p>12/15/2025</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <p>
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm py-6 rounded-2xl">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-full bg-blue-300">SJ</div>
                <div>
                  <h3>Sarah Johnson</h3>
                  <p>12/15/2025</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <p>
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm py-6 rounded-2xl">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-full bg-blue-300">SJ</div>
                <div>
                  <h3>Sarah Johnson</h3>
                  <p>12/15/2025</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <p>
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
            <div className="border border-gray-300 hover:shadow-xl max-w-sm py-6 rounded-2xl">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-full bg-blue-300">SJ</div>
                <div>
                  <h3>Sarah Johnson</h3>
                  <p>12/15/2025</p>
                </div>
              </div>
              <div className="flex">
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
                <Star className="text-yellow-500 fill-yellow-500" />
              </div>
              <p>
                Absolutely amazing service! They made our wedding day perfect.
                Every detail was taken care of and the team was so professional.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;

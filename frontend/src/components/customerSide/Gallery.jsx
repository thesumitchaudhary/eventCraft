import React, { useState } from "react";
import {
  Bell,
  Calendar,
  Settings,
  LogOut,
  Palette,
  CreditCard,
  Image,
  Star,
  CircleQuestionMark,
  TrendingUp,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Header from "./header-footer components/Header";
import Footer from "./header-footer components/Footer";
import LiveIcon from "./header-footer components/live icon components/LiveIcon";

// this is for import image
import anniversary from "../../images/Anniversary.jpg";
import anniversary2 from "../../images/Anniversary2.jpg";
import birthday from "../../images/birthday.jpg";
import birthday2 from "../../images/birthday2.jpg";
import corporate from "../../images/corporate.jpg";
import corporate2 from "../../images/corporate2.jpg";
import wedding from "../../images/wedding.jpg";
import wedding2 from "../../images/wedding-2.jpg";
import wedding3 from "../../images/Wedding3.jpg";

const Gallery = () => {
  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main>
        <section className="min-h-50 my-10 mx-5 bg-gray-50 rounded-xl border border-gray-300">
          <div className="p-5 ">
            <div className="grid grid-rows-3 gap-2">
              <h4 className="font-bold text-xl font-semibold">Event Gallery</h4>
              <p className="text-gray-500 text-sm">
                View photos from our events
              </p>
            </div>
            <div>
              <h2 className="font-bold text-2xl text-center mt-2">
                Our Event Gallery
              </h2>
              <p className="text-center mt-4">
                Browse through our collection of beautifully executed events
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 my-5 mx-5">
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Wedding
                  </span>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h3 className="font-semibold text-lg mb-2">Elegant Garden Wedding</h3>
                  <p className="text-sm text-gray-600">
                    Beautiful outdoor wedding with floral arrangements
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Corporate
                  </span>
                  <img src={corporate} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Modern Corporate Event</h4>
                  <p className="text-sm text-gray-600">
                    Professional business conference setup
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Birthday
                  </span>
                  <img src={birthday} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Magical Birthday Party</h4>
                  <p className="text-sm text-gray-600">Colorful and fun birthday celebration</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Anniversary
                  </span>
                  <img src={anniversary} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Romantic Anniversary</h4>
                  <p className="text-sm text-gray-600">Intimate anniversary dinner setup</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Wedding
                  </span>
                  <img src={wedding2} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Beach Wedding Ceremony</h4>
                  <p className="text-sm text-gray-600">Stunning beachside wedding celebration</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Corporate
                  </span>
                  <img src={corporate2} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Product Launch Event</h4>
                  <p className="text-sm text-gray-600">High-tech product unveiling event</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Birthday
                  </span>
                  <img src={birthday2} className="max-w-sm" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Kids Birthday Extravaganza</h4>
                  <p className="text-sm text-gray-600">Fun-filled childrens party with activities</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Anniversary
                  </span>
                  <img src={anniversary2} className="h-64 w-full" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Golden Anniversary</h4>
                  <p className="text-sm text-gray-600">50th anniversary celebration</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300">
              <div>
                <div className="relative">
                  <span className="absolute top-5 left-73 bg-gray-100 px-2 py-1 rounded-md text-xs">
                    Wedding
                  </span>
                  <img src={wedding3} className="h-64 w-full" alt="" />
                </div>
                <div className="grid grid-rows-2 mt-5 mx-4">
                  <h4 className="font-semibold text-lg mb-2">Rustic Wedding</h4>
                  <p className="text-sm text-gray-600">Charming barn wedding setup</p>
                </div>
              </div>
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

export default Gallery;

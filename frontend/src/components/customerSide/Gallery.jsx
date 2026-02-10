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

// this is for import image
import wedding from "../../images/wedding.jpg";

const Gallery = () => {
  return (
    <div className="bg-[#eeeeef] min-h-screen">
      <Header />
      <main>
        <section className="min-h-50 max-w-6xl my-10 mx-auto bg-gray-50 rounded-xl border border-gray-300">
          <div className="p-5">
            <div>
              <h2 className="font-bold">Event Gallery</h2>
              <p>View photos from our events</p>
            </div>
            <div>
              <h3>Our Event Gallery</h3>
              <p>
                Browse through our collection of beautifully executed events
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div>
                  <h4>Elegant Garden Wedding</h4>
                  <p>Beautiful outdoor wedding with floral arrangements</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div>
                  <h4>Elegant Garden Wedding</h4>
                  <p>Beautiful outdoor wedding with floral arrangements</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div>
                  <h4>Elegant Garden Wedding</h4>
                  <p>Beautiful outdoor wedding with floral arrangements</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div>
                  <h4>Elegant Garden Wedding</h4>
                  <p>Beautiful outdoor wedding with floral arrangements</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div>
                  <h4>Elegant Garden Wedding</h4>
                  <p>Beautiful outdoor wedding with floral arrangements</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden border-gray-300 max-w-max">
              <div>
                <div>
                  <img src={wedding} className="max-w-sm" alt="" />
                </div>
                <div>
                  <h4>Elegant Garden Wedding</h4>
                  <p>Beautiful outdoor wedding with floral arrangements</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
